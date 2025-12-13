import { z } from 'zod';

export const categorySchema = z
  .object({
    name: z
      .string({ error: 'Name of category is required.' })
      .min(2, 'Name must be at least 2 characters.')
      .transform((val) => val.trim()),
    slug: z.string().min(2, 'Slug must be at least 2 characters'),
    description: z.string().optional(),
    totalProductsCount: z.number().optional(),
  })
  .strict();

export const updateCategorySchema = categorySchema.partial().strict();
