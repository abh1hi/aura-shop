/*
  File: metainflu/backend/routes/vendorRoutes.js
  Purpose: Defines all API routes specifically for the vendor panel, secured by the 'vendor' middleware.
*/
const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect, vendor } = require('../middleware/authMiddleware');

// All routes here require protection and a vendor role
router.use(protect, vendor);

// @route   GET /api/vendor/dashboard/stats
// @desc    Get dashboard statistics for the vendor
router.get('/dashboard/stats', vendorController.getVendorDashboardStats);

// @route   GET /api/vendor/products
// @desc    Get all products uploaded by the vendor
router.get('/products', vendorController.getVendorProducts);

// @route   GET /api/vendor/orders
// @desc    Get all orders containing products by this vendor
router.get('/orders', vendorController.getVendorOrders);

// @route   PUT /api/vendor/orders/:orderId/ship
// @desc    Mark a specific item in an order as shipped (for the vendor's products)
router.put('/orders/:orderId/ship', vendorController.updateOrderItemToShipped);

module.exports = router;
