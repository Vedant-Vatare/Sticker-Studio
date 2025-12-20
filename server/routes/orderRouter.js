import Router from 'express';
import { authenticateUser } from '../middlewares/authUser.js';
import {
  cancelOrder,
  getOrder,
  placeOrder,
  verifyOrder,
} from '../controllers/orderController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { validatePlaceOrder } from '../middlewares/orderValidation.js';

const router = Router();

router.use(asyncHandler(authenticateUser));
router.get('/', asyncHandler(getOrder));
router.post('/place-order', validatePlaceOrder, asyncHandler(placeOrder));
router.post('/verify-order', asyncHandler(verifyOrder));
router.post('/cancel-order', asyncHandler(cancelOrder));

export default router;
