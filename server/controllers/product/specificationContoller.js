import prisma from '../../db/db.js';
import { z } from 'zod';
import {
  specificationSchema,
  updateSpecificationSchema,
} from 'shared/schemas/product/specificationSchema.js';
import { checkVariantExists } from '../../utils/product.js';

export async function createProductSpecification(req, res) {
  try {
    let { productId, variantId } = req.query;
    if (!variantId) variantId = null;

    const { data, success, error } = specificationSchema.safeParse({
      data: req.body.data,
      productId,
      variantId,
    });

    if (!success)
      return res.status(400).json({
        message: 'invalid specification data',
        error: z.treeifyError(error),
      });

    if (variantId) {
      const doesVariantExist = await checkVariantExists(productId, variantId);

      if (!doesVariantExist) {
        return res.status(400).json({
          error: 'product id does not have given variant id',
        });
      }
    }

    const specification = await prisma.productSpecification.create({
      data: data,
    });

    return res
      .status(201)
      .json({ message: 'product specification created', specification });
  } catch (e) {
    if (e.code === 'P2002') {
      return res
        .status(201)
        .json({ error: 'specification for the product already exists' });
    }
    console.log(e);

    return res.status(500).json({ e });
  }
}

export async function getProductSpecification(req, res) {
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

  const specifications = await prisma.productSpecification.findMany({
    where: { productId },
  });

  return res
    .status(200)
    .json({ message: 'product specification fetched', specifications });
}

export async function updateProductSpecification(req, res) {
  let { productId, variantId } = req.query;
  if (!variantId) variantId = null;

  const {
    data: parsed,
    success,
    error,
  } = updateSpecificationSchema.safeParse({
    data: req.body.data,
    productId,
    variantId,
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

  const oldSpecs = await prisma.productSpecification.findFirst({
    where: { productId, variantId },
    select: {
      data: true,
    },
  });

  if (!oldSpecs) {
    return res
      .status(400)
      .json({ error: 'product with given ids does not exists' });
  }

  const updatedSpecsData = {
    ...oldSpecs.data,
    ...parsed.data.updateFields,
    ...parsed.data.newFields,
  };

  parsed.data.removeFields?.forEach((field) => {
    delete updatedSpecsData[field];
  });

  await prisma.productSpecification.updateMany({
    where: { productId, variantId },
    data: {
      data: updatedSpecsData,
    },
  });

  return res.status(200).json({
    message: 'product specifications updated',
    updatedSpecifications: updatedSpecsData,
  });
}

export async function removeProductSpecification(req, res) {
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

    await prisma.productSpecification.deleteMany({
      where: { productId, variantId },
    });

    return res.status(200).json({ message: 'product specification deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res
        .status(400)
        .json({ message: 'product specifications does not exists' });
    }
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
