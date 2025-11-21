import { Router } from 'express';
import {
  createUser,
  createUserAddress,
  deleteUserAddress,
  getUserAddressById,
  getUserAllAddresses,
  LoginUser,
  updateUserAddress,
  addProductToWishlist,
  getUserWishlist,
  deleteUserWishlist,
  getUserProfile,
  sendVerificationCode,
  verifyEmailCode,
  updateUserProfile,
} from '../controllers/userController.js';
import {
  validateCreateAddress,
  validateUpdateAddress,
  validateUpdateProfile,
  validateUserLogin,
  validateUserSignup,
} from '../middlewares/userValidation.js';
import asyncHandler from '../utils/asyncHandler.js';
import { authenticateUser } from '../middlewares/authUser.js';

const router = Router();
router.post('/signup', validateUserSignup, asyncHandler(createUser));
router.post('/login', validateUserLogin, asyncHandler(LoginUser));
router.post(
  '/address',
  authenticateUser,
  validateCreateAddress,
  asyncHandler(createUserAddress),
);
router.get('/profile', authenticateUser, asyncHandler(getUserProfile));
router.post(
  '/profile',
  authenticateUser,
  validateUpdateProfile,
  asyncHandler(updateUserProfile),
);

router.get('/address/all', authenticateUser, asyncHandler(getUserAllAddresses));
router.get('/address/:id', authenticateUser, asyncHandler(getUserAddressById));
router.patch(
  '/address/:id',
  authenticateUser,
  validateUpdateAddress,
  asyncHandler(updateUserAddress),
);
router.delete(
  '/address/:id',
  authenticateUser,
  asyncHandler(deleteUserAddress),
);

router.post(
  '/wishlist/:id',
  authenticateUser,
  asyncHandler(addProductToWishlist),
);

router.get('/wishlist', authenticateUser, asyncHandler(getUserWishlist));
router.delete(
  '/wishlist/:id',
  authenticateUser,
  asyncHandler(deleteUserWishlist),
);

router.get('/send-verification-code/', asyncHandler(sendVerificationCode));
router.get('/verify-email-code/', asyncHandler(verifyEmailCode));
router.post('/create-user', asyncHandler(createUser));

export default router;
