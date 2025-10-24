const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
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
const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, variant } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
        (item) =>
            item.product.toString() === productId &&
            item.variant === variant
    );

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity, variant });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    res.status(201).json(populatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = cart.items.filter((item) => item._id.toString() !== req.params.id);
        await cart.save();
        const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(populatedCart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});


// @desc    Update cart item
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const itemIndex = cart.items.findIndex((item) => item._id.toString() === req.params.id);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            await cart.save();
            const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
            res.json(populatedCart);
        } else {
            res.status(404);
            throw new Error('Item not found');
        }
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = [];
        await cart.save();
        res.json({ message: 'Cart cleared' });
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
};