import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Public browse & Admin create
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

// User reviews creation
router.route('/:id/reviews')
  .post(protect, createProductReview);

// Public detail & Admin edit/delete
router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;
