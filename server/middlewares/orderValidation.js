import prisma from '../db/db.js';
import { createOrderSchema } from 'shared/schemas/orderSchema.js';
import { z } from 'zod';

export async function validateCreateOrder(req, res, next) {
  try {
    const zodResponse = createOrderSchema.safeParse(req.body);
    if (!zodResponse.success) {
      return res.status(400).json({
        message: 'invalid order data',
        error: z.treeifyError(zodResponse.error),
      });
    }

    const userOrderProducts = zodResponse.data.orderItems;
    const userOrderProductIds = userOrderProducts.map((item) => item.productId);

    if (new Set(userOrderProductIds).size !== userOrderProducts.length) {
      return res.status(400).json({
        error: 'Duplicate products found in ordered items.',
      });
    }

    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: userOrderProductIds },
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (dbProducts.length !== userOrderProducts.length) {
      const foundIds = new Set(dbProducts.map((p) => p.id));
      const unavailableProducts = userOrderProductIds.filter(
        (id) => !foundIds.has(id),
      );

      return res.status(400).json({
        error: 'Some products in the order are not available.',
        unavailableProducts,
      });
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let totalAmount = 0;

    const validatedItems = userOrderProducts.map((item) => {
      const product = productMap.get(item.productId);
      totalAmount += product.price * item.quantity;
      return {
        id: item.productId,
        price: product.price,
        orderedQuantity: item.quantity,
      };
    });

    req.orderData = {
      orderItems: validatedItems,
      totalAmount,
    };

    next();
  } catch (error) {
    console.error('Order validation error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
}
