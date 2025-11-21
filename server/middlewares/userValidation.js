import bcrypt from 'bcryptjs';
import {
  updateUserAddressSchema,
  userAddressSchema,
  userLoginSchema,
  userSchema,
  updateProfileSchema,
} from 'shared/schemas/userSchema.js';
import { z } from 'zod';

export function validateUserSignup(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      status: 'error',
      message: 'Email and password are required',
    });
  }

  const { error } = userSchema.safeParse({ email, password });
  if (error) {
    return res.status(401).json({
      status: 'error',
      message: error.issues.map((issue) => issue.message).join(', '),
    });
  }
  next();
}

export async function validateUserLogin(req, res, next) {
  const { email, password } = req.body;

  const { error } = userLoginSchema.safeParse({ email, password });
  if (error) {
    return res.status(401).json({
      success: false,
      status: 'error',
      message: error.issues.map((issue) => issue.message).join(', '),
    });
  }
  next();
}

export async function validateUpdateProfile(req, res, next) {
  const { full_name, password } = req.body;
  const { success, error, data } = updateProfileSchema.safeParse({
    full_name,
    password,
  });

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  if (!success) {
    return res.status(400).json({
      message: 'Invalid data',
      error: z.treeifyError(error),
    });
  }
  req.updateData = data;
  next();
}

export async function validateCreateAddress(req, res, next) {
  const { error } = userAddressSchema.safeParse(req.body);
  if (error) {
    return res.status(401).json({
      success: false,
      status: 'error',
      message: error.issues.map((issue) => issue.message).join(', '),
    });
  }
  next();
}

export async function validateUpdateAddress(req, res, next) {
  const { error } = updateUserAddressSchema.safeParse(req.body);
  if (error) {
    return res.status(401).json({
      success: false,
      status: 'error',
      message: error.issues.map((issue) => issue.message).join(', '),
    });
  }
  next();
}
