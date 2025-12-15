import { z } from 'zod';

const productSchema = z.object({
  name: z
    .string({ required_error: 'Name of product is required.' })
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be under 100 characters.')
    .transform((val) => val.trim()),
  slug: z
    .string()
    .min(2)
    .transform((val) => val.trim()),
  description: z
    .string()
    .max(1000, 'Description must be under 1000 characters.')
    .optional()
    .transform((val) => (val ? val.trim() : val)),

  price: z.coerce.number().min(1, 'Price is required.'),
  basePrice: z.coerce.number().min(1, 'Price is required.'),

  stock: z.coerce
    .number()
    .min(0, 'Stock must be a valid non-negative number')
    .default(0),

  category: z.string().optional(),
});

export const productCreateSchema = productSchema;
export const updateProductSchema = productSchema
  .extend({
    stock: z.coerce
      .number()
      .min(0, 'Stock must be a valid non-negative number')
      .optional(),
  })
  .partial();

export const productCollectionSchema = z
  .object({
    categoryId: z.string({ required_error: 'Category ID is required.' }),
    productId: z.string({ required_error: 'Product ID is required.' }),
  })
  .strict();

export const updateProductCollectionSchema = productCollectionSchema.partial();

export const productRecommendationSchema = z
  .object({
    'productId[]': z
      .union([z.string().min(1), z.array(z.string().min(1))])
      .optional()
      .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : [])),
    'categorySlug[]': z
      .union([z.string().min(1), z.array(z.string().min(1))])
      .optional()
      .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : [])),
    limit: z.coerce.number().min(1).max(100).default(10),
  })
  .refine(
    (data) =>
      data['productId[]']?.length > 0 || data['categorySlug[]']?.length > 0,
    {
      message: 'At least one of productIds or categorySlugs is required',
      path: [],
    },
  );
