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
    const { productId, quantity = 1, variant, variantId, variantSku } = req.body;

    console.log('Cart Controller - Add to cart request:', {
        productId,
        quantity,
        variantId,
        variantSku,
        hasVariant: !!variant
    });

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Find existing item based on product and variant
    const itemIndex = cart.items.findIndex(item => {
        const isSameProduct = item.product.toString() === productId;
        
        // If no variant info provided, match items without variants
        if (!variantId && !variantSku && !variant) {
            return isSameProduct && !item.variantId;
        }
        
        // Match by variantId first
        if (variantId) {
            return isSameProduct && item.variantId === variantId;
        }
        
        // Match by variantSku if provided
        if (variantSku) {
            return isSameProduct && item.variantId === variantSku;
        }
        
        // Fallback to comparing variant objects (legacy)
        if (variant && item.variant) {
            try {
                const itemVariantStr = typeof item.variant === 'string' 
                    ? item.variant 
                    : JSON.stringify(item.variant);
                const newVariantStr = typeof variant === 'string' 
                    ? variant 
                    : JSON.stringify(variant);
                return isSameProduct && itemVariantStr === newVariantStr;
            } catch (err) {
                console.error('Error comparing variants:', err);
                return false;
            }
        }
        
        return false;
    });

    if (itemIndex > -1) {
        // Update existing item quantity
        cart.items[itemIndex].quantity += quantity;
        console.log('Updated existing cart item');
    } else {
        // Create new cart item
        const newItem = {
            product: productId,
            quantity
        };

        // Add variant information if provided
        if (variantId) {
            newItem.variantId = variantId;
        } else if (variantSku) {
            newItem.variantId = variantSku;
        }

        if (variant) {
            newItem.variant = variant;
        }

        // Backward compatibility: extract legacy size/color from variant
        if (variant && typeof variant === 'object') {
            if (variant.attributes) {
                const sizeAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'size');
                const colorAttr = variant.attributes.find(attr => attr.name.toLowerCase() === 'color');
                
                if (sizeAttr) newItem.size = sizeAttr.value;
                if (colorAttr) newItem.color = colorAttr.value;
            }
        }

        cart.items.push(newItem);
        console.log('Added new cart item:', newItem);
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    console.log('Cart saved successfully, returning:', {
        itemCount: populatedCart.items.length,
        cartId: populatedCart._id
    });

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