import { customAlphabet } from 'nanoid';
import prisma from '../db/db.js';
import { Prisma } from '../generated/prisma/index.js';
import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';

const customOrderId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export async function getOrder(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
                price: true,
              },
            },
            variant: {
              select: {
                id: true,
                sku: true,
                variant: true,
                images: true,
                price: true,
              },
            },
          },
        },
        shippingAddress: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch all variant options
    const allVariantIds = orders
      .flatMap((order) => order.orderItems)
      .filter((item) => item.variant)
      .flatMap((item) => item.variant.variant);

    const uniqueVariantIds = [...new Set(allVariantIds)];

    const options =
      uniqueVariantIds.length > 0
        ? await prisma.option.findMany({
            where: { id: { in: uniqueVariantIds } },
          })
        : [];

    res.status(200).json({
      message: 'order details fetched',
      orders,
      options,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'failed to fetch order details',
      error: error.message,
    });
  }
}

export async function placeOrder(req, res) {
  let ORDER_ID;
  let razorpayOrder;

  try {
    const dbOrder = await prisma.$transaction(
      async (tx) => {
        const orderItems = req.orderData.orderItems;
        const productIds = orderItems.map((item) => item.id);
        const variantIds = orderItems
          .filter((item) => item.variantId)
          .map((item) => item.variantId);

        const products = await tx.product.findMany({
          where: { id: { in: productIds } },
          select: {
            id: true,
            price: true,
            stock: true,
            reservedStock: true,
            productVariants: {
              where:
                variantIds.length > 0 ? { id: { in: variantIds } } : undefined,
              select: {
                id: true,
                price: true,
                stock: true,
                reservedStock: true,
              },
            },
          },
        });

        const productMap = new Map(products.map((p) => [p.id, p]));
        let calculatedTotal = 0;

        for (const item of orderItems) {
          const product = productMap.get(item.id);
          if (!product) {
            const err = new Error('Product not available');
            err.status = 400;
            throw err;
          }

          if (item.variantId) {
            const variant = product.productVariants.find(
              (v) => v.id === item.variantId,
            );
            if (!variant) {
              const err = new Error('Variant not available');
              err.status = 400;
              throw err;
            }
            calculatedTotal += variant.price * item.orderedQuantity;
          } else {
            calculatedTotal += product.price * item.orderedQuantity;
          }
        }

        const discount = calculatedTotal > 999 ? 100 : 0;
        const shippingCharges = 20;
        const totalAmount = calculatedTotal - discount + shippingCharges;
        ORDER_ID = `OD-${customOrderId()}`;

        // reserving stock with database-level validation

        for (const item of orderItems) {
          if (item.variantId) {
            const result = await tx.$executeRaw`
              UPDATE "ProductVariant"
              SET "reservedStock" = "reservedStock" + ${item.orderedQuantity}
              WHERE id = ${item.variantId}
              AND "stock" >= "reservedStock" + ${item.orderedQuantity}
            `;

            if (result === 0) {
              const variant = await tx.productVariant.findUnique({
                where: { id: item.variantId },
                select: { stock: true, reservedStock: true },
              });

              const err = new Error('Insufficient stock available');
              err.status = 400;
              err.details = {
                productId: item.id,
                variantId: item.variantId,
                available: variant ? variant.stock - variant.reservedStock : 0,
                requested: item.orderedQuantity,
              };
              throw err;
            }
          } else {
            const result = await tx.$executeRaw`
              UPDATE "Product"
              SET "reservedStock" = "reservedStock" + ${item.orderedQuantity}
              WHERE id = ${item.id}
              AND "stock" >= "reservedStock" + ${item.orderedQuantity}
            `;

            if (result === 0) {
              // Update failed - insufficient stock
              const product = await tx.product.findUnique({
                where: { id: item.id },
                select: { stock: true, reservedStock: true },
              });

              const err = new Error('Insufficient stock available');
              err.status = 400;
              err.details = {
                productId: item.id,
                available: product ? product.stock - product.reservedStock : 0,
                requested: item.orderedQuantity,
              };
              throw err;
            }
          }
        }

        // Create the order
        const order = await tx.order.create({
          data: {
            id: ORDER_ID,
            userId: req.userId,
            totalAmount,
            transactionId: '',
            paymentStatus: 'pending',
            orderStatus: 'pending',
            shippingAddressId: req.body.shippingAddressId,
            orderItems: {
              create: orderItems.map((item) => ({
                productId: item.id,
                variantId: item.variantId || null,
                quantity: item.orderedQuantity,
                amount: item.price * item.orderedQuantity,
              })),
            },
          },
          include: {
            orderItems: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    images: true,
                  },
                },
                variant: {
                  select: {
                    id: true,
                    sku: true,
                    variant: true,
                    images: true,
                    price: true,
                  },
                },
              },
            },
          },
        });

        return { order, totalAmount };
      },
      {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: 'Serializable', // Strongest isolation level
      },
    );

    const razorpayOptions = {
      amount: Math.round(dbOrder.totalAmount * 100),
      currency: 'INR',
      receipt: ORDER_ID,
      notes: { userId: req.userId },
    };

    razorpayOrder = await razorpay.orders.create(razorpayOptions);

    await prisma.order.update({
      where: { id: ORDER_ID },
      data: { transactionId: razorpayOrder.id },
    });

    const variantIds = dbOrder.order.orderItems
      .filter((item) => item.variant)
      .flatMap((item) => item.variant.variant);

    const options =
      variantIds.length > 0
        ? await prisma.option.findMany({
            where: { id: { in: variantIds } },
          })
        : [];

    return res.status(201).json({
      message: 'order created successfully',
      order: { ...dbOrder.order, transactionId: razorpayOrder.id },
      options,
      razorpay: {
        orderId: razorpayOrder.id,
        amount: dbOrder.totalAmount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);

    return res.status(error.status || 500).json({
      message: error.message || 'failed to create order',
      ...(error.details || {}),
    });
  }
}

export async function verifyOrder(req, res) {
  try {
    if (
      !req.body ||
      !req.body.razorpay_order_id ||
      !req.body.razorpay_payment_id ||
      !req.body.razorpay_signature
    ) {
      return res
        .status(400)
        .json({ message: 'Missing required fields for verifying pyament' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (
      !crypto.timingSafeEqual(
        Buffer.from(generatedSignature),
        Buffer.from(razorpay_signature),
      )
    ) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const order = await prisma.$transaction(
      async (tx) => {
        const existingOrder = await tx.order.findFirst({
          where: {
            transactionId: razorpay_order_id,
            userId: req.userId,
          },
          include: {
            orderItems: {
              include: {
                product: true,
                variant: true,
              },
            },
          },
        });

        if (!existingOrder) {
          const err = new Error('Order not found');
          err.status = 404;
          throw err;
        }

        if (existingOrder.paymentStatus === 'paid') {
          return existingOrder;
        }

        const updatedOrder = await tx.order.update({
          where: { id: existingOrder.id },
          data: {
            paymentStatus: 'paid',
            orderStatus: 'confirmed',
          },
          include: {
            orderItems: {
              include: {
                product: true,
                variant: true,
              },
            },
          },
        });

        await Promise.all(
          updatedOrder.orderItems.map((item) => {
            if (item.variantId) {
              return tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                  stock: { decrement: item.quantity },
                  reservedStock: { decrement: item.quantity },
                },
              });
            } else {
              return tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: { decrement: item.quantity },
                  reservedStock: { decrement: item.quantity },
                },
              });
            }
          }),
        );

        return updatedOrder;
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return res.status(200).json({
      message: 'Payment verified and order confirmed',
      order,
    });
  } catch (error) {
    console.error('Payment verification error:', error);

    return res.status(error.status || 500).json({
      message: error.message || 'Failed to verify payment',
    });
  }
}

export async function cancelOrder(req, res) {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findFirst({
          where: {
            id: orderId,
            userId: req.userId,
          },
          include: { orderItems: true },
        });

        if (!order) {
          const err = new Error('Order not found');
          err.status = 404;
          throw err;
        }

        if (order.orderStatus !== 'pending') {
          const err = new Error(
            'Cannot cancel order that is already processed',
          );
          err.status = 400;
          throw err;
        }

        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { orderStatus: 'cancelled' },
          include: { orderItems: true },
        });

        await Promise.all(
          order.orderItems.map((item) => {
            if (item.variantId) {
              return tx.productVariant.update({
                where: { id: item.variantId },
                data: { reservedStock: { decrement: item.quantity } },
              });
            } else {
              return tx.product.update({
                where: { id: item.productId },
                data: { reservedStock: { decrement: item.quantity } },
              });
            }
          }),
        );

        return updatedOrder;
      },
      {
        maxWait: 5000,
        timeout: 10000,
      },
    );

    return res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    });
  } catch (error) {
    console.error('Order cancellation error:', error);
    return res.status(error.status || 500).json({
      message: error.message || 'Failed to cancel order',
    });
  }
}
