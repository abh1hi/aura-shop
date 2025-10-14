/*
  File: metainflu/backend/routes/adminRoutes.js
  Purpose: This file defines the API routes for admin-related endpoints.
  It uses middleware to protect these routes, ensuring only authenticated admins can access them.
*/
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getPendingCategories,
  approveCategory,
  rejectCategory,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes in this file are protected by admin middleware
router.use(protect, admin);

// User management
router.route('/users').get(getUsers);

// Category management
router.route('/categories/pending').get(getPendingCategories);
router.route('/categories/:id/approve').put(approveCategory);
router.route('/categories/:id').delete(rejectCategory); // Using DELETE to reject/delete

module.exports = router;