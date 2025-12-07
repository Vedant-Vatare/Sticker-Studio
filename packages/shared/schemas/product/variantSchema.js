import { z } from 'zod';

export const optionSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const updateOptionSchema = optionSchema.partial();

export const productVariantSchema = z.object({
  productId: z.string(),
  variant: z.array(z.string()),
  sku: z.string().optional(),
  price: z.coerce.number().min(1, 'Price is required.'),
  stock: z.coerce
    .number()
    .min(0, 'Stock must be a valid non-negative number')
    .default(0),
});

export const updateProductVariantSchema = productVariantSchema.partial();
