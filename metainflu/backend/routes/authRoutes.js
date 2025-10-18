/*
  File: metainflu/backend/routes/authRoutes.js
  Purpose: Defines authentication routes, including a new dedicated route for admin login.
*/

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, loginVendor } = require('../controllers/authController');

// Define the routes for user authentication
router.post('/register', registerUser);
router.post('/login', loginUser);

// Define the new route for admin login
router.post('/admin/login', loginAdmin);

// Define the new route for vendor login
router.post('/vendor/login', loginVendor);

module.exports = router;
