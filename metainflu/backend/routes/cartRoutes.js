const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Get user's cart
router.get('/', protect, cartController.getCart);

// Add item to cart
router.post('/', protect, cartController.addItemToCart);

// Remove item from cart
router.delete('/:productId', protect, cartController.removeItemFromCart);

module.exports = router;
