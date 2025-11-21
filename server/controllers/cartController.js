import prisma from '../db/db.js';

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
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cartItem = await prisma.userCart.create({
      data: {
        userId: req.userId,
        productId: productId,
        quantity: 1,
      },
      include: { product: true },
    });
    res.status(201).json({ message: 'Product added to cart', cartItem });
  } catch (e) {
    if (e.code === 'P2002') {
      return res
        .status(409)
        .json({ message: 'Product already in cart', error: e.message });
    }

    throw error;
  }
}

export async function updateCartItem(req, res) {
  try {
    const { cartItemId, quantity } = req.body;

    const cartItem = await prisma.userCart.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: quantity,
      },
    });

    res.json({ message: 'Cart item updated successfully', cartItem });
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
