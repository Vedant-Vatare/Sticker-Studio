import { z } from 'zod';

export const userSchema = z.object({
  full_name: z.string({ message: 'Invalid name format' }),
  email: z.email({ message: 'Invalid email format' }),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10}$/, 'Invalid phone number '),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const userLoginSchema = z.object({
  email: z.email({ message: 'Invalid email format' }),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export const updateProfileSchema = userSchema
  .pick({
    full_name: true,
    email: true,
    phone: true,
    password: true,
  })
  .partial();

export const userAddressSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(128, { message: 'Name must be 2 to 128 characters long' }),
  phone: z
    .string()
    .length(10, { message: 'Phone number must be 10 digits long' }),
  address: z
    .string()
    .min(5)
    .max(256, { message: 'Address must be 5 to 256 characters long' }),
  city: z
    .string()
    .min(2)
    .max(70, { message: 'City must be 2 to 70 characters long' }),
  pincode: z
    .string()
    .min(6, { message: 'Pincode must be 6 characters long' })
    .max(6, { message: 'Pincode must be 6 characters long' }),
  state: z
    .string()
    .min(2)
    .max(70, { message: 'State must be 2 to 70 characters long' }),
  country: z.string().min(2).max(50).default('India'),
});

export const updateUserAddressSchema = userAddressSchema.partial();
