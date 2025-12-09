import { z } from 'zod';
import { dimensionSchema } from '../../../packages/shared/schemas/product/dimensionsSchema.js';
import prisma from '../../db/db.js';

export async function createProductDimensions(req, res) {
  try {
    const { productId } = req.params;
    const { success, data, error } = dimensionSchema.safeParse({
      productId,
      ...req.body,
    });

    if (!success)
      return res.status(400).json({
        message: 'invalid dimensions data',
        error: z.treeifyError(error),
      });

    const productDimensions = await prisma.productDimension.create({
      data: data,
    });

    return res
      .status(201)
      .json({ message: 'product dimensions created', productDimensions });
  } catch (e) {
    if (e.code === 'P2002') {
      return res
        .status(201)
        .json({ error: 'dimensions for the product already exists' });
    }
    if (e.code === 'P2003') {
      return res.status(201).json({ error: 'product does not exist' });
    }
  }
}

export async function getProductDimensions(req, res) {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({
      error: 'invalid product id',
    });
  }

  const productDimensions = await prisma.productDimension.findUnique({
    where: { productId },
  });

  return res
    .status(200)
    .json({ message: 'product dimensions fetched', productDimensions });
}

export async function updateProductDimensions(req, res) {
  const { productId } = req.params;

  const {
    data: parsed,
    success,
    error,
  } = dimensionSchema.safeParse({
    productId,
    ...req.body,
  });

  if (!success) {
    return res.status(400).json({
      message: 'invalid specification data',
      error: z.treeifyError(error),
    });
  }

  const updatedDimensions = await prisma.productDimension.update({
    where: { productId },
    data: parsed,
  });

  return res.status(200).json({
    message: 'product dimensions updated',
    updatedDimensions,
  });
}

export async function removeProductDimensions(req, res) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        error: 'invalid product id',
      });
    }

    await prisma.productDimension.delete({
      where: { productId },
    });

    return res.status(200).json({ message: 'product dimensions deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res
        .status(400)
        .json({ message: 'product dimensions does not exists' });
    }
  }
}
