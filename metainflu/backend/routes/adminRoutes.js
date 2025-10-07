/*
  File: metainflu/backend/routes/adminRoutes.js
  Purpose: This file defines the API routes for admin-related endpoints.
  It uses middleware to protect these routes, ensuring only authenticated admins can access them.
*/
const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Defines a GET route to fetch all users, protected by authentication and admin role checks.
router.route('/users').get(protect, admin, getUsers);

module.exports = router;

