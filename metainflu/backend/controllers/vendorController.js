/*
  File: metainflu/backend/controllers/vendorController.js
  Purpose: Handles all backend logic for the Vendor Panel (role: 'vendor').
  This includes fetching vendor-specific products, orders, and dashboard analytics.
*/
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// --- Helper Functions ---

/**
 * Calculates dashboard statistics (Sales, Orders, Returns).
 * @param {object} vendorId - The ID of the currently logged-in vendor.
 * @returns {object} - Statistics object.
 */
const getDashboardStats = asyncHandler(async (vendorId) => {
  // 1. Get all products owned by the vendor
  const vendorProducts = await Product.find({ user: vendorId }).select('_id');
  const vendorProductIds = vendorProducts.map(p => p._id);

  // 2. Find orders that contain at least one of the vendor's products
  const vendorOrders = await Order.find({
    'items.product': { $in: vendorProductIds },
  });

  const totalOrders = vendorOrders.length;
  let totalRevenue = 0;
  let newOrdersCount = 0; // Assuming 'pending' is new

  vendorOrders.forEach(order => {
    // Only calculate revenue based on the vendor's products within the order
    order.items.forEach(item => {
      if (vendorProductIds.includes(item.product.toString())) {
        // Simple approximation: assuming item price is proportional to total price.
        // For accurate revenue, a line item schema with unit price is needed.
        // For now, we'll just sum the whole order total for a simple count/sum.
        // NOTE: In a real e-commerce system, this calculation is much more complex!
        totalRevenue += order.total;
      }
    });

    if (order.status === 'pending') {
      newOrdersCount++;
    }
  });
  
  // Mock logic for pending returns, as Order model doesn't explicitly track returns yet
  const pendingReturns = 2; // Mock data for now

  return {
    totalSales: totalRevenue, // Should be calculated revenue from vendor items
    totalOrders: totalOrders,
    newOrders: newOrdersCount,
    pendingReturns: pendingReturns,
  };
});


// @desc    Get vendor dashboard stats
// @route   GET /api/vendor/dashboard
// @access  Private/Vendor
const getVendorDashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats(req.user._id);
  res.json(stats);
});

// @desc    Get all products created by the logged-in vendor
// @route   GET /api/vendor/products
// @access  Private/Vendor
const getVendorProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id }).populate('category');
  res.json(products);
});

// @desc    Get orders that contain products from the logged-in vendor
// @route   GET /api/vendor/orders
// @access  Private/Vendor
const getVendorOrders = asyncHandler(async (req, res) => {
  // 1. Get all products owned by the vendor
  const vendorProducts = await Product.find({ user: req.user._id }).select('_id');
  const vendorProductIds = vendorProducts.map(p => p._id);

  // 2. Find orders that contain at least one of the vendor's products
  const orders = await Order.find({
    'items.product': { $in: vendorProductIds },
  }).populate('user', 'name email'); // Populate the customer's info

  // Optional: Filter order items to only show the vendor's items in the response
  const filteredOrders = orders.map(order => {
    return {
      ...order._doc, // spread all original order fields
      items: order.items.filter(item => vendorProductIds.includes(item.product.toString())),
    };
  });
  
  res.json(filteredOrders);
});

// @desc    Update a specific item in an order to 'shipped' (assuming the item belongs to the vendor)
// @route   PUT /api/vendor/orders/:orderId/ship
// @access  Private/Vendor
const updateOrderItemToShipped = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { productId } = req.body;

  const order = await Order.findById(orderId);
  const product = await Product.findById(productId);

  if (!order || !product) {
    res.status(404);
    throw new Error('Order or Product not found');
  }

  // Ensure the product belongs to the current vendor
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to ship this product');
  }

  // Find the item in the order
  const item = order.items.find(item => item.product.toString() === productId);

  if (item) {
    // Logic to mark the specific item as shipped (or the order if all items are shipped)
    // NOTE: This logic should be adapted to the Order model's actual status tracking needs.
    // Since the current Order model only has one `status`, we'll simplify and update the order status.
    
    order.status = 'shipped'; // Simplified update for the whole order
    
    await order.save();
    res.json({ message: 'Order item marked as shipped (order status updated to shipped).', order });
  } else {
    res.status(404);
    throw new Error('Product not found in order');
  }
});


module.exports = {
  getVendorDashboard,
  getVendorProducts,
  getVendorOrders,
  updateOrderItemToShipped,
};
