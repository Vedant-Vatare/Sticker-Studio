import prisma from '../db/db.js';
import { isValidVariant, productHaveVariant } from '../utils/product.js';

export async function getUserCart(req, res) {
  const cart = await prisma.userCart.findMany({
    where: { userId: req.userId },
    select: {
      id: true,
      quantity: true,
      product: {
        select: {
          id: true,
          name: true,
          description: true,
          images: true,
          price: true,
          stock: true,
          reservedStock: true,
        },
      },
      variant: {
        select: {
          id: true,
          images: true,
          stock: true,
          price: true,
          variant: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  res.json({ message: 'Cart fetched successfully', cart });
}

export async function addToCart(req, res) {
  try {
    const { productId, variantId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const hasVariant = await productHaveVariant(productId);

    if (hasVariant && !variantId) {
      return res.status(409).json({ message: 'select a variant for product' });
    }

    if (variantId) {
      const validVariant = await isValidVariant(productId, variantId);

      if (!validVariant) {
        return res
          .status(400)
          .json({ message: 'Variant does not belong to this product' });
      }
    }

    const cartItem = await prisma.userCart.create({
      data: {
        userId: req.userId,
        productId,
        variantId: variantId ?? null,
      },
      include: {
        product: true,
        variant: true,
      },
    });

    return res.status(201).json({
      message: 'Product added to cart',
      cartItem,
    });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ message: 'product is already in cart' });
    }
    if (e.code === 'P2003') {
      return res
        .status(409)
        .json({ message: 'Invalid product Id or variant Id' });
    }
    throw e;
  }
}

export async function updateCartItem(req, res) {
  try {
    const { cartItemId, quantity } = req.body;

    const cartItem = await prisma.userCart.findUnique({
      where: {
        id: cartItemId,
      },
      select: {
        product: {
          select: {
            stock: true,
            reservedStock: true,
          },
        },
        variant: {
          select: {
            stock: true,
            // add reserved stock later
          },
        },
      },
    });

    // check stock of variant if it exists otherwise use from product
    const availableStock = cartItem.variant
      ? cartItem.variant.stock - (cartItem.variant.reservedStock || 0)
      : cartItem.product.stock - (cartItem.product.reservedStock || 0);

    if (availableStock < quantity) {
      return res.json({
        message: 'Insufficient stock available.',
        availableStock,
      });
    }

    const updatedCartItem = await prisma.userCart.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: quantity,
      },
      select: {
        id: true,
        quantity: true,
        product: true,
        variant: true,
      },
    });

    return res
      .status(200)
      .json({ message: 'Cart item updated successfully', updatedCartItem });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).json({ message: 'Cart item not found' });
    }
    throw error;
  }
}

export async function removeFromCart(req, res) {
  try {
    const cartItemId = req.body.cartItemId;
    if (!cartItemId) {
      return res.status(400).json({ message: 'invalid cart item id' });
    }

    await prisma.userCart.delete({
      where: {
        id: cartItemId,
        userId: req.userId,
      },
    });

    res.json({ message: 'Cart item removed successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(400).json({ message: 'Cart item not found' });
    }
    throw error;
  }
}
