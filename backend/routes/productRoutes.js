import express from 'express';
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have this middleware

const router = express.Router();

router.route('/').get(getProducts).post(protect, createProduct);
router.route('/top').get(getTopProducts);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, deleteProduct)
  .put(protect, updateProduct);

export default router;
