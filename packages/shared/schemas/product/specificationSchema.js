import { z } from 'zod';

export const specificationSchema = z.object({
  productId: z.string(),
  data: z.record(z.string(), z.string({ error: 'invalid specification data' })),
});

export const updateSpecificationSchema = z.object({
  productId: z.string(),
  data: z.object({
    removeFields: z.array(z.string()).optional(),
    updateFields: z.record(z.string(), z.string()).optional(),
    newFields: z.record(z.string(), z.string()).optional(),
  }),
});
