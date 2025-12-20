import { z } from 'zod';

export const createOrderSchema = z.object({
  shippingAddressId: z.uuid({
    error: 'Invalid shipping address ID',
  }),
  orderItems: z
    .array(
      z.object({
        productId: z.uuid({
          error: 'Invalid product ID',
        }),
        variantId: z.string().optional().nullable(),
        quantity: z
          .number()
          .int()
          .positive({
            error: 'Quantity must be a positive integer',
          })
          .min(1, {
            error: 'Quantity must be at least 1',
          }),
      }),
    )
    .min(1, {
      error: 'At least one order item is required',
    }),
});
