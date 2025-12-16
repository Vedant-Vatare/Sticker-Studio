import { Router } from 'express';
import { authenticateUser } from '../../middlewares/authUser.js';
import asyncHandler from '../../utils/asyncHandler.js';
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from '../../controllers/product/wishlistController.js';
const router = Router();

router.post('/add', authenticateUser, asyncHandler(addToWishlist));
router.get('/', authenticateUser, asyncHandler(getWishlist));
router.delete(
  '/:productId',
  authenticateUser,
  asyncHandler(removeFromWishlist),
);

export default router;
