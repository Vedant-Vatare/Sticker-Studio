import prisma from '../../db/db.js';

export async function getWishlist(req, res) {
  const wishlist = await prisma.wishlist.findMany({
    where: { userId: req.userId },
  });

  return res
    .status(200)
    .json({ message: 'wishlist fetched successfully', wishlist });
}
export async function addToWishlist(req, res) {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: req.userId,
        productId,
      },
    });
    return res.status(201).json({
      message: 'Product added to wishlist successfully',
      wishlistItem,
    });
  } catch (e) {
    if (e.code === 'P2002') {
      return res
        .status(400)
        .json({ message: 'Product is already in the wishlist' });
    }

    console.log(e);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export async function removeFromWishlist(req, res) {
  const { productId } = req.params;

  await prisma.wishlist.delete({
    where: {
      userId_productId: {
        userId: req.userId,
        productId,
      },
    },
  });
  return res.status(200).json({ message: 'Product removed from wishlist' });
}
