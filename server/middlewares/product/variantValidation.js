import { z } from 'zod';
import {
  optionSchema,
  productVariantSchema,
  updateProductVariantSchema,
  updateOptionSchema,
} from 'shared/schemas/product/variantSchema.js';
import prisma from '../../db/db.js';

const validateNewVariants = async (newProductVariant, excludeId) => {
  try {
    const allVariants = await prisma.productVariant.findMany({
      where: {
        productId: newProductVariant.productId,
        NOT: {
          id: excludeId,
        },
      },
      select: {
        id: true,
        variant: true,
      },
    });

    if (allVariants.length > 0) {
      const newVariant = newProductVariant.variant;

      const containsDuplicate = allVariants.some(({ variant }) => {
        if (variant.length !== newVariant.length) return false;

        return variant.every((id) => newVariant.includes(id));
      });

      if (containsDuplicate) {
        return { success: false, message: 'variant already exists' };
      }

      const options = await prisma.option.findMany({
        where: {
          id: {
            in: newVariant,
          },
        },
      });
      const validIds = new Set(options.map((o) => o.id));

      const invalidIds = newVariant.filter((id) => !validIds.has(id));

      if (invalidIds.length > 0) {
        return { success: false, message: 'variant contains invalid id' };
      }
    }

    return { success: true, message: 'validation success' };
  } catch (e) {
    console.log('Error while checking variant', e);
    return { success: false, message: 'error occurrd while checking variants' };
  }
};

export async function validateCreateVariant(req, res, next) {
  const {
    success,
    error,
    data: productVariant,
  } = productVariantSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: 'invalid option data',
      error: z.treeifyError(error),
    });
  }
  const result = await validateNewVariants(productVariant);
  if (!result.success) {
    return res.status(400).json({
      error: result.message || 'Error occured while validating varients',
    });
  }

  req.productVariantData = productVariant;
  next();
}

export async function validateUpdateVariant(req, res, next) {
  const {
    success,
    data: productVariant,
    error,
  } = updateProductVariantSchema.safeParse(req.body || {});
  if (!success) {
    return res.status(400).json({
      message: 'invalid product variant data',
      error: z.treeifyError(error),
    });
  }
  if (productVariant.variant?.length > 0) {
    const { id } = req.params;
    const result = await validateNewVariants(productVariant, id);
    if (!result.success) {
      return res.status(400).json({
        error: result.message || 'Error occured while validating varients',
      });
    }
  }

  req.updateData = productVariant;
  next();
}

export function validateCreateOption(req, res, next) {
  const { success, error } = optionSchema.safeParse(req.body);
  if (!success) {
    return res.status(400).json({
      message: 'invalid option data',
      error: z.treeifyError(error),
    });
  }
  next();
}

export function validateUpdateOption(req, res, next) {
  const { data, success, error } = updateOptionSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: 'invalid option data',
      error: z.treeifyError(error),
    });
  }
  req.updateData = data;
  next();
}
