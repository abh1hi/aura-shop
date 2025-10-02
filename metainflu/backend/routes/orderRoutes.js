const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// Get all orders for a user
router.get('/', protect, orderController.getOrders);

// Get a single order by ID
router.get('/:id', protect, orderController.getOrderById);

// Create a new order
router.post('/', protect, orderController.createOrder);

// Update an order to paid
router.put('/:id/pay', protect, orderController.updateOrderToPaid);

// Update an order to delivered
router.put('/:id/deliver', protect, orderController.updateOrderToDelivered);

module.exports = router;
