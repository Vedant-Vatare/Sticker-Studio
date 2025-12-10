import { z } from 'zod';

export const dimensionSchema = z.object({
  productId: z.string(),
  variantId: z.union([z.string(), z.null()]).transform((v) => (!v ? null : v)),

  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  thickness: z.number().optional(),
  unit: z.string().default('cm'),
});

export const updatedimensionSchema = dimensionSchema.partial();
