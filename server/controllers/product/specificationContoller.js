import prisma from '../../db/db.js';
import { z } from 'zod';
import {
  specificationSchema,
  updateSpecificationSchema,
} from 'shared/schemas/product/specificationSchema.js';

export async function createProductSpecification(req, res) {
  try {
    const { productId } = req.params;
    const { data, success, error } = specificationSchema.safeParse({
      data: req.body.data,
      productId: productId,
    });
    if (!success)
      return res.status(400).json({
        message: 'invalid specification data',
        error: z.treeifyError(error),
      });

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
  }
}

export async function getProductSpecification(req, res) {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({
      error: 'invalid product id',
    });
  }

  const specification = await prisma.productSpecification.findUnique({
    where: { productId },
  });

  return res
    .status(200)
    .json({ message: 'product specification fetched', specification });
}

export async function updateProductSpecification(req, res) {
  const { productId } = req.params;
  const {
    data: parsed,
    success,
    error,
  } = updateSpecificationSchema.safeParse({
    data: req.body.data,
    productId: productId,
  });

  if (!success) {
    return res.status(400).json({
      message: 'invalid specification data',
      error: z.treeifyError(error),
    });
  }

  const oldSpecs = await prisma.productSpecification.findUnique({
    where: { productId },
    select: {
      data: true,
    },
  });
  if (!oldSpecs) {
    return res
      .status(400)
      .json({ error: 'product with given id does not exists' });
  }
  const updatedSpecsData = {
    ...oldSpecs.data,
    ...parsed.data.updateFields,
    ...parsed.data.newFields,
  };

  parsed.data.removeFields?.forEach((field) => {
    delete updatedSpecsData[field];
  });

  const newSpecs = await prisma.productSpecification.update({
    where: { productId },
    data: {
      data: updatedSpecsData,
    },
  });

  return res.status(200).json({
    message: 'product specifications updated',
    specification: newSpecs,
  });
}

export async function removeProductSpecification(req, res) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        error: 'invalid product id',
      });
    }

    await prisma.productSpecification.delete({
      where: { productId },
    });

    return res.status(200).json({ message: 'product specification deleted' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res
        .status(400)
        .json({ message: 'product specifications does not exists' });
    }
  }
}
