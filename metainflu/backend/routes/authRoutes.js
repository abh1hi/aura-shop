/*
  File: metainflu/backend/routes/authRoutes.js
  Purpose: Defines authentication routes, including registration, login variants, and profile.
  Updated to handle CORS preflight requests properly.
*/

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, loginVendor, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Health check for auth routes
router.get('/health', (req, res) => {
  res.status(200).json({
    message: 'Auth routes are working',
    timestamp: new Date().toISOString(),
    available_endpoints: {
      'POST /register': 'User registration',
      'POST /login': 'User login',
      'POST /admin/login': 'Admin login',
      'POST /vendor/login': 'Vendor login',
      'GET /profile': 'Get user profile (requires auth)'
    }
  });
});

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Specific role-based login routes
router.post('/admin/login', loginAdmin);
router.post('/vendor/login', loginVendor);

// Protected routes (authentication required)
router.get('/profile', protect, getProfile);

// Test route to verify CORS is working
router.get('/test-cors', (req, res) => {
  res.status(200).json({
    message: 'CORS is working correctly',
    origin: req.headers.origin,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;