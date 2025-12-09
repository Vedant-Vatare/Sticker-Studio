import { z } from 'zod';

export const dimensionSchema = z
  .object({
    productId: z.string(),

    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    unit: z.string().default('cm'),
  })
  .strict();
