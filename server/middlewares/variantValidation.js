import { z } from 'zod';
import {
  optionSchema,
  updateOptionSchema,
} from '../../packages/shared/schemas/variantSchema.js';

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
