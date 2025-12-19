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

export async function productHaveVariant(productId) {
  return await prisma.productVariant.findFirst({
    where: { productId },
    select: { id: true },
  });
}

export async function isValidVariant(productId, variantId) {
  return await prisma.productVariant.findFirst({
    where: {
      id: variantId,
      productId,
    },
    select: {
      id: true,
      variant: true,
    },
  });
}
