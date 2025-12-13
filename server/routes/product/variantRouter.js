import { Router } from 'express';
import { authenticateAdmin } from '../../middlewares/authUser.js';
import upload from '../../utils/multerConfig.js';
import asyncHandler from '../../utils/asyncHandler.js';
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
} from '../../controllers/product/variantController.js';
import {
  validateCreateOption,
  validateCreateVariant,
  validateUpdateOption,
  validateUpdateVariant,
} from '../../middlewares/product/variantValidation.js';
const router = Router();

router.get('/:productId', asyncHandler(getAllVariants));

router.use(authenticateAdmin);

router.post(
  '/add',
  [upload.array('images'), validateCreateVariant],
  asyncHandler(createProductVariant),
);
router.patch(
  '/:id',
  [upload.array('images'), validateUpdateVariant],
  asyncHandler(updateProductVariant),
);
router.delete('/:id', asyncHandler(deleteProductVariant));

router.post('/option', [validateCreateOption], asyncHandler(createOption));
router.get('/option/all', asyncHandler(getAllOptions));
router.get('/option/:name', asyncHandler(getOptionByName));
router.patch('/option/:id', [validateUpdateOption], asyncHandler(updateOption));
router.delete('/option/:id', asyncHandler(deleteOption));

export default router;
