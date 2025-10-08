/*
  File: metainflu/backend/routes/productRoutes.js
  Purpose: This file defines the API routes for product-related actions.
  It is updated to allow both Admins and Vendors to manage products (though controller enforces ownership for Vendors).
*/
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
// Import all necessary middleware
const { protect, admin, vendor } = require('../middleware/authMiddleware');

// Public routes for fetching products.
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Combined middleware: Use a simple function to check if the user is either admin OR vendor.
const adminOrVendor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'vendor')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized to perform this action');
    }
}

// Routes for creating and managing products (Admin or Vendor access)
// Note: The `protect` middleware runs first, attaching `req.user`.
router.post('/', protect, adminOrVendor, productController.createProduct);
router.put('/:id', protect, adminOrVendor, productController.updateProduct);
router.delete('/:id', protect, adminOrVendor, productController.deleteProduct);

module.exports = router;
