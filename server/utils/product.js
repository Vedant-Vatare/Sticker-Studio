import prisma from '../db/db.js';

export async function checkVariantExists(productId, varientId) {
  if (!varientId) return false;

  const variants = await prisma.productVariant.findMany({
    where: {
      productId,
    },
  });

  return variants.some((v) => v.id === varientId);
}
