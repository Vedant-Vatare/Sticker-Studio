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
  try {
    const discount = req.orderData.totalAmount > 999 ? 100 : 0;
    const shippingCharges = 20;
    const totalAmount = req.orderData.totalAmount - discount + shippingCharges;
    const ORDER_ID = `ORD-${customOrderId()}`;

    const razorpayOptions = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: ORDER_ID,
      notes: {
        userId: req.userId,
      },
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    const order = await prisma.order.create({
      data: {
        id: ORDER_ID,
        userId: req.userId,
        orderItems: {
          create: req.orderData.orderItems.map((item) => ({
            productId: item.id,
            quantity: item.orderedQuantity,
            amount: item.price * item.orderedQuantity,
          })),
        },
        totalAmount: totalAmount,
        transactionId: razorpayOrder.id,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        shippingAddressId: req.body.shippingAddressId,
      },
      include: { orderItems: true },
    });

    return res.status(201).json({
      message: 'order created successfully',
      order,
      razorpay: {
        orderId: razorpayOrder.id,
        amount: totalAmount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        receipt: razorpayOrder.receipt,
      },
    });
  } catch (error) {
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

      for (const item of updatedOrder.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }
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
