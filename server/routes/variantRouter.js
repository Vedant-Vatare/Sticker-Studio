import { Router } from 'express';
import { authenticateAdmin } from '../middlewares/authUser.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  createOption,
  createProductVariant,
  deleteOption,
  deleteProductVariant,
  getAllOptions,
  getAllVariants,
  getOptionByName,
  updateOption,
  updateProductVariant,
} from '../controllers/variantController.js';
import {
  validateCreateOption,
  validateCreateVariant,
  validateUpdateOption,
  validateUpdateVariant,
} from '../middlewares/variantValidation.js';
const router = Router();

router.post(
  '/add',
  [authenticateAdmin, validateCreateVariant],
  createProductVariant,
);
router.get('/:productId', asyncHandler(getAllVariants));
router.put(
  '/:id',
  [authenticateAdmin, validateUpdateVariant],
  asyncHandler(updateProductVariant),
);
router.delete('/:id', authenticateAdmin, asyncHandler(deleteProductVariant));

router.post(
  '/option',
  [authenticateAdmin, validateCreateOption],
  asyncHandler(createOption),
);
router.get('/option/all', authenticateAdmin, asyncHandler(getAllOptions));
router.get('/option/:name', authenticateAdmin, asyncHandler(getOptionByName));
router.put(
  '/option/:id',
  [authenticateAdmin, validateUpdateOption],
  asyncHandler(updateOption),
);
router.delete('/option/:id', authenticateAdmin, asyncHandler(deleteOption));

export default router;
