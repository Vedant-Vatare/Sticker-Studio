import { Router } from 'express';
import { authenticateAdmin } from '../middlewares/authUser.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  createOption,
  deleteOption,
  getAllOptions,
  getOptionByName,
  updateOption,
} from '../controllers/variantController.js';
import {
  validateCreateOption,
  validateUpdateOption,
} from '../middlewares/variantValidation.js';
const router = Router();
// managing product options
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

// managing product variants

export default router;
