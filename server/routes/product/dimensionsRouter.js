import { Router } from 'express';
import { authenticateAdmin } from '../../middlewares/authUser.js';
import {
  createProductDimensions,
  getProductDimensions,
  removeProductDimensions,
  updateProductDimensions,
} from '../../controllers/product/dimensionsController.js';
import asyncHandler from '../../utils/asyncHandler.js';
const router = Router();

router.get('/', asyncHandler(getProductDimensions));

router.use(authenticateAdmin);

router.post('/', asyncHandler(createProductDimensions));
router.patch('/', asyncHandler(updateProductDimensions));
router.delete('/', asyncHandler(removeProductDimensions));

export default router;
