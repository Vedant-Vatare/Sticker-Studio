import { z } from 'zod';

export const optionSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const updateOptionSchema = optionSchema.partial();
