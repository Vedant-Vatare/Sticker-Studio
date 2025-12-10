import { z } from 'zod';
import {
  dimensionSchema,
  updatedimensionSchema,
} from '../../../packages/shared/schemas/product/dimensionsSchema.js';
import prisma from '../../db/db.js';
import { checkVariantExists } from '../../utils/product.js';

export async function createProductDimensions(req, res) {
  try {
    let { productId, variantId } = req.query;
    if (!variantId) variantId = null;

    const { success, data, error } = dimensionSchema.safeParse({
      productId,
      variantId,
      ...req.body,
    });

    if (!success) {
      return res.status(400).json({
        message: 'invalid dimensions data',
        error: z.treeifyError(error),
      });
    }

    if (variantId) {
      const doesVariantExist = await checkVariantExists(productId, variantId);

      if (!doesVariantExist) {
        return res.status(400).json({
          error: 'product id does not have given variant id',
        });
      }
    }

    const existsDimentsions = await prisma.productDimension.findFirst({
      where: {
        productId,
        variantId,
      },
      select: {
        id: true,
      },
    });

    if (existsDimentsions) {
      return res
        .status(400)
        .json({ error: 'dimensions for given fields already exists' });
    }

    const productDimensions = await prisma.productDimension.create({
      data: data,
    });

    return res
      .status(201)
      .json({ message: 'product dimensions created', productDimensions });
  } catch (e) {
    if (e.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'dimensions for the product already exists' });
    }

    if (e.code === 'P2003') {
      return res
        .status(400)
        .json({ error: 'product or variant does not exist' });
    }

    console.log(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProductDimensions(req, res) {
  let { productId, variantId } = req.query;
  if (!variantId) variantId = null;

  if (!productId) {
    return res.status(400).json({
      error: 'invalid product id',
    });
  }

  if (variantId) {
    const doesVariantExist = await checkVariantExists(productId, variantId);

    if (!doesVariantExist) {
      return res.status(400).json({
        error: 'product id does not have given variant id',
      });
    }
  }

  const productDimensions = await prisma.productDimension.findMany({
    where: {
      productId,
    },
  });

  return res
    .status(200)
    .json({ message: 'product dimensions fetched', productDimensions });
}

export async function updateProductDimensions(req, res) {
  let { productId, variantId } = req.query;
  if (!variantId) variantId = null;
  const {
    data: parsed,
    success,
    error,
  } = updatedimensionSchema.safeParse({
    ...req.body,
  });

  if (!success) {
    return res.status(400).json({
      message: 'invalid specification data',
      error: z.treeifyError(error),
    });
  }

  if (variantId) {
    const doesVariantExist = await checkVariantExists(productId, variantId);

    if (!doesVariantExist) {
      return res.status(400).json({
        error: 'product id does not have given variant id',
      });
    }
  }

  await prisma.productDimension.updateMany({
    where: { productId, variantId },
    data: parsed,
  });

  return res.status(200).json({
    message: 'product dimensions updated',
    updatedDimensions: parsed,
  });
}

export async function removeProductDimensions(req, res) {
  try {
    let { productId, variantId } = req.query;
    if (!variantId) variantId = null;

    if (!productId) {
      return res.status(400).json({
        error: 'invalid product id',
      });
    }

    if (variantId) {
      const doesVariantExist = await checkVariantExists(productId, variantId);

      if (!doesVariantExist) {
        return res.status(400).json({
          error: 'product id does not have given variant id',
        });
      }
    }

    await prisma.productDimension.deleteMany({
      where: { productId, variantId: variantId },
    });

    return res.status(200).json({ message: 'product dimensions deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res
        .status(400)
        .json({ message: 'product dimensions does not exists' });
    }
    console.log(e);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
