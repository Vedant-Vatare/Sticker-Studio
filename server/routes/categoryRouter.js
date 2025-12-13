import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { authenticateAdmin } from '../middlewares/authUser.js';
import {
  validateCreateCategory,
  validateUpdateCategory,
} from '../middlewares/categoryValidation.js';
import {
  createCategory,
  createProductCategory,
  deleteCategory,
  deleteProductCategory,
  getAllCategories,
  getAllCategoriesForProduct,
  updateCategory,
} from '../controllers/categoryController.js';

const router = Router();

router.get('/all', asyncHandler(getAllCategories));
router.get('/product/:id', asyncHandler(getAllCategoriesForProduct));

router.use(authenticateAdmin);

router.post('/create', validateCreateCategory, asyncHandler(createCategory));
router.patch('/:id', validateUpdateCategory, asyncHandler(updateCategory));
router.delete('/:id', asyncHandler(deleteCategory));

router.post('/product/create', asyncHandler(createProductCategory));
router.delete('/product/:id', asyncHandler(deleteProductCategory));

export default router;
