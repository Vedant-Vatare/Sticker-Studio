import { z } from 'zod';
import prisma from '../db/db.js';
import { createOrderSchema } from 'shared/schemas/orderSchema.js';

async function validateOrderData(userOrderProducts) {
  const itemKeys = userOrderProducts.map(
    (item) => `${item.productId}-${item.variantId || 'null'}`,
  );
  if (new Set(itemKeys).size !== userOrderProducts.length) {
    const err = new Error(
      'Duplicate product-variant combinations found in ordered items.',
    );
    err.status = 400;
    throw err;
  }

  const userOrderProductIds = userOrderProducts.map((item) => item.productId);
  const userOrderVariantIds = userOrderProducts
    .filter((item) => item.variantId)
    .map((item) => item.variantId);

  // Single query to fetch all needed data
  const dbProducts = await prisma.product.findMany({
    where: {
      id: { in: userOrderProductIds },
    },
    select: {
      id: true,
      price: true,
      productVariants: {
        where:
          userOrderVariantIds.length > 0
            ? { id: { in: userOrderVariantIds } }
            : undefined,
        select: {
          id: true,
          price: true,
        },
      },
    },
  });

  if (dbProducts.length !== new Set(userOrderProductIds).size) {
    const foundIds = new Set(dbProducts.map((p) => p.id));
    const unavailableProducts = userOrderProductIds.filter(
      (id) => !foundIds.has(id),
    );

    const err = new Error('Some products in the order are not available.');
    err.status = 400;
    err.details = { unavailableProducts };
    throw err;
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));
  const validatedItems = [];

  for (const item of userOrderProducts) {
    const product = productMap.get(item.productId);

    if (!product) {
      const err = new Error('Product not found');
      err.status = 404;
      err.details = { productId: item.productId };
      throw err;
    }

    const hasVariants = product.productVariants.length > 0;

    if (item.variantId) {
      const variant = product.productVariants.find(
        (v) => v.id === item.variantId,
      );

      if (!variant) {
        const err = new Error('Invalid variant for product');
        err.status = 400;
        err.details = {
          productId: item.productId,
          variantId: item.variantId,
        };
        throw err;
      }

      validatedItems.push({
        id: item.productId,
        variantId: item.variantId,
        price: variant.price,
        orderedQuantity: item.quantity,
      });
    } else {
      if (hasVariants) {
        const err = new Error('Variant selection required for product');
        err.details = { productId: item.productId };
        err.status = 409;
        throw err;
      }

      validatedItems.push({
        id: item.productId,
        variantId: null,
        price: product.price,
        orderedQuantity: item.quantity,
      });
    }
  }

  return {
    validatedItems,
  };
}

export async function validatePlaceOrder(req, res, next) {
  try {
    const zodResponse = createOrderSchema.safeParse(req.body);
    if (!zodResponse.success) {
      return res.status(400).json({
        message: 'invalid order data',
        error: z.treeifyError(zodResponse.error),
      });
    }

    try {
      const validationResponse = await validateOrderData(
        zodResponse.data.orderItems,
      );

      req.orderData = {
        orderItems: validationResponse.validatedItems,
      };

      next();
    } catch (e) {
      console.log(e);
      return res.status(e.status || 400).json({
        message: e.message,
        ...(e.details || {}),
      });
    }
  } catch (error) {
    console.error('order checkout failed', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}
