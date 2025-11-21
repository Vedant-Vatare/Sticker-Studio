import Router from 'express';
import { authenticateUser } from '../middlewares/authUser.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeFromCart,
} from '../controllers/cartController.js';
import { validateUpdateCart } from '../middlewares/cartvalidation.js';
const router = Router();

router.use(asyncHandler(authenticateUser));
router.get('/', asyncHandler(getUserCart));
router.post('/add', asyncHandler(addToCart));
router.put('/', validateUpdateCart, asyncHandler(updateCartItem));
router.delete('/', asyncHandler(removeFromCart));

export default router;
