import { customAlphabet } from 'nanoid';
import prisma from '../db/db.js';
import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';

const customOrderId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);

export async function getOrder(req, res) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { orderItems: { include: { product: true } } },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json({ message: 'order details fetched', orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'failed to fetch order details', error: error.message });
  }
}

export async function createOrder(req, res) {
  let totalAmount;
  let ORDER_ID;
  let dbOrder;
  try {
    dbOrder = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: {
          id: { in: req.orderData.orderItems.map((item) => item.id) },
        },
        select: {
          id: true,
          stock: true,
          reservedStock: true,
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of req.orderData.orderItems) {
        const product = productMap.get(item.id);
        if (!product) {
          throw new Error(`Product ${item.id} not found`);
        }
        const availableStock = product.stock - (product.reservedStock || 0);
        if (availableStock < item.orderedQuantity) {
          throw new Error(
            `Insufficient stock for product ${item.id}. Available: ${availableStock}, Requested: ${item.orderedQuantity}`,
          );
        }
      }

      const discount = req.orderData.totalAmount > 999 ? 100 : 0;
      const shippingCharges = 20;
      totalAmount = req.orderData.totalAmount - discount + shippingCharges;
      ORDER_ID = `OD-${customOrderId()}`;

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
            create: req.orderData.orderItems.map((item) => ({
              productId: item.id,
              quantity: item.orderedQuantity,
              amount: item.price * item.orderedQuantity,
            })),
          },
        },
        include: { orderItems: true },
      });

      await Promise.all(
        req.orderData.orderItems.map((item) =>
          tx.product.update({
            where: { id: item.id },
            data: {
              reservedStock: { increment: item.orderedQuantity },
            },
          }),
        ),
      );

      return order;
    });

    const razorpayOptions = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: ORDER_ID,
      notes: { userId: req.userId },
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    await prisma.order.update({
      where: { id: ORDER_ID },
      data: { transactionId: razorpayOrder.id },
    });

    return res.status(201).json({
      message: 'order created successfully',
      order: { ...dbOrder, transactionId: razorpayOrder.id },
      razorpay: {
        orderId: razorpayOrder.id,
        amount: totalAmount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    await prisma.$transaction(async (tx) => {
      await Promise.all(
        req.orderData.orderItems.map((item) =>
          tx.product.update({
            where: { id: item.id },
            data: { reservedStock: { decrement: item.orderedQuantity } },
          }),
        ),
      );

      if (ORDER_ID) {
        await tx.order.delete({ where: { id: ORDER_ID } });
      }
      throw error;
    });

    return res
      .status(500)
      .json({ message: 'failed to create order', error: error.message });
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
      return res.status(400).json({ message: 'Missing required fields' });
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

    const order = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { transactionId: razorpay_order_id },
        data: {
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
        },
        include: { orderItems: true },
      });

      await Promise.all(
        updatedOrder.orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
              reservedStock: { decrement: item.quantity },
            },
          }),
        ),
      );

      return updatedOrder;
    });

    return res.status(200).json({
      message: 'Payment verified and order confirmed',
      order,
    });
  } catch (error) {
    console.error('Payment verification error:', error);

    return res.status(500).json({
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
}
