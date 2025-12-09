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

router.get('/:productId', asyncHandler(getProductDimensions));

router.use(authenticateAdmin);

router.post('/:productId', asyncHandler(createProductDimensions));
router.patch('/:productId', asyncHandler(updateProductDimensions));
router.delete('/:productId', asyncHandler(removeProductDimensions));

export default router;
