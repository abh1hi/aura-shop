
// File: backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/adminController');
// const { protect, admin } = require('../middleware/authMiddleware'); // Uncomment when you build the middleware

// router.get('/dashboard', protect, admin, getAdminDashboard);

module.exports = router;

