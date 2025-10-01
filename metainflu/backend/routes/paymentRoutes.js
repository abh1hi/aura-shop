
// File: backend/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const { processPayment } = require('../controllers/paymentController');

// Define routes for payment-related actions
router.post('/', processPayment);

module.exports = router;
