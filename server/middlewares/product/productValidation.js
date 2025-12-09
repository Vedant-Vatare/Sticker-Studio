import {
  productCollectionSchema,
  productCreateSchema,
  updateProductSchema,
} from 'shared/schemas/product/productSchema.js';

export async function validateCreateProduct(req, res, next) {
  const zodResult = productCreateSchema.safeParse(req.body);

  if (!zodResult.success) {
    return res.status(400).json({
      message: 'Invalid product data.',
      error: zodResult.error.issues,
    });
  }
  req.validatedBody = zodResult.data;

  next();
}

export async function validateUpdateProduct(req, res, next) {
  const zodResult = updateProductSchema.safeParse(req.body);

  if (!zodResult.success) {
    return res.status(400).json({
      message: 'Invalid product data.',
      error: zodResult.error.issues,
    });
  }

  req.validatedBody = zodResult.data;

  next();
}

export async function validateProductCollection(req, res, next) {
  const { success, error } = productCollectionSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: 'Invalid collection data.',
      error: z.treeifyError(error),
    });
  }
  next();
}
