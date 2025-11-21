import Router from 'express';
import { authenticateUser } from '../middlewares/authUser.js';
import {
  createOrder,
  getOrder,
  verifyOrder,
} from '../controllers/orderController.js';
import asyncHandler from '../utils/asyncHandler.js';
import { validateCreateOrder } from '../middlewares/orderValidation.js';

const router = Router();

router.use(asyncHandler(authenticateUser));
router.get('/', asyncHandler(getOrder));
router.post('/create-order', validateCreateOrder, asyncHandler(createOrder));
router.post('/verify-order', asyncHandler(verifyOrder));

export default router;
