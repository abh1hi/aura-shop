/*
  File: metainflu/backend/routes/productRoutes.js
  Purpose: This file defines the API routes for product-related actions.
  It now uses middleware to restrict creating, updating, and deleting products to admins only.
*/
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes for fetching products.
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Admin-only routes for managing products.
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;

