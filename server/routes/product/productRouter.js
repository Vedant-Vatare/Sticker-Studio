import Router from 'express';
import upload from '../../utils/multerConfig.js';
import {
  validateCreateProduct,
  validateProductCollection,
  validateUpdateProduct,
} from '../../middlewares/product/productValidation.js';
import {
  createProduct,
  createProductCollection,
  deleteProduct,
  deleteProductCollection,
  getProductById,
  getProductRecommendation,
  getProductsByCollection,
  getProductsBySearch,
  updateProduct,
} from '../../controllers/product/productController.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { authenticateAdmin } from '../../middlewares/authUser.js';

const router = Router();

router.post(
  '/',
  authenticateAdmin,
  upload.array('images'),
  validateCreateProduct,
  asyncHandler(createProduct),
);

router.get('/search', asyncHandler(getProductsBySearch));
router.get('/collection', asyncHandler(getProductsByCollection));
router.get('/recommendations', asyncHandler(getProductRecommendation));
router.get('/:id', asyncHandler(getProductById));

router.patch(
  '/:id',
  authenticateAdmin,
  upload.array('images'),
  validateUpdateProduct,
  asyncHandler(updateProduct),
);

router.delete('/:id', authenticateAdmin, asyncHandler(deleteProduct));
router.delete(
  '/collection/:collectionId',
  authenticateAdmin,
  asyncHandler(deleteProductCollection),
);

router.post(
  '/collection/create',
  authenticateAdmin,
  validateProductCollection,
  asyncHandler(createProductCollection),
);

export default router;
