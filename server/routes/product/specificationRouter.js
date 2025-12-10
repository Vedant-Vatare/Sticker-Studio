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

router.get('/', asyncHandler(getProductSpecification));

router.use(authenticateAdmin);

router.post('/', asyncHandler(createProductSpecification));
router.patch('/', asyncHandler(updateProductSpecification));
router.delete('/', asyncHandler(removeProductSpecification));

export default router;
