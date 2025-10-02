const Cart = require('../models/Cart');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (cart) {
    res.json(cart);
  } else {
    res.json({ items: [] });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    // Cart exists, check if product is already in cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity = quantity;
    } else {
      // Product does not exist in cart, add new item
      cart.items.push({ product: productId, quantity, size, color });
    }
    cart = await cart.save();
    res.status(201).json(cart);
  } else {
    // No cart for user, create new cart
    const newCart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity, size, color }],
    });
    res.status(201).json(newCart);
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (cart) {
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    res.json({ message: 'Item removed' });
  } else {
    res.status(404);
    throw new Error('Cart not found');
  }
});

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart,
};
