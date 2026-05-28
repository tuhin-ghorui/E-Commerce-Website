import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// User purchase & Admin overview
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

// User history
router.route('/myorders')
  .get(protect, getMyOrders);

// Order details query
router.route('/:id')
  .get(protect, getOrderById);

// Admin order status update
router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

export default router;
