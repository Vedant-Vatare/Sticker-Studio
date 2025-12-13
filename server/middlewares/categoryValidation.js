import { z } from 'zod';
import {
  categorySchema,
  updateCategorySchema,
} from 'shared/schemas/categorySchema.js';

export function validateCreateCategory(req, res, next) {
  const { success, error } = categorySchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: 'invalid category data',
      error: error,
    });
  }
  next();
}

export function validateUpdateCategory(req, res, next) {
  const zodResponse = updateCategorySchema.safeParse(req.body);

  if (!zodResponse.success) {
    return res.status(400).json({
      message: 'Invalid category data',
      error: z.treeifyError(zodResponse.error),
    });
  }
  next();
}
