import { Router } from 'express';
import { authenticateAdmin } from '../../middlewares/authUser.js';
import asyncHandler from '../../utils/asyncHandler.js';
import {
  createProductSpecification,
  getProductSpecification,
  removeProductSpecification,
  updateProductSpecification,
} from '../../controllers/product/specificationContoller.js';

const router = Router();

router.get('/:productId', asyncHandler(getProductSpecification));
router.use(authenticateAdmin);
router.post('/:productId', asyncHandler(createProductSpecification));
router.patch('/:productId', asyncHandler(updateProductSpecification));
router.delete('/:productId', asyncHandler(removeProductSpecification));

export default router;
