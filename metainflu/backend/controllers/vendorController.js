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
 * @param {number} days - The number of days to filter the data by.
 * @returns {object} - Statistics object.
 */
// @desc    Get vendor dashboard stats
// @route   GET /api/vendor/dashboard/stats
// @access  Private/Vendor
const getVendorDashboardStats = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { days } = req.query;

  // 1. Get all products for the vendor
  const vendorProducts = await Product.find({ user: vendorId });
  const vendorProductIds = vendorProducts.map(p => p._id);

  // 2. Define date filter for orders
  const dateFilter = {};
  if (days) {
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));
    dateFilter.createdAt = { $gte: date };
  }

  // 3. Find all orders containing the vendor's products within the date range
  const orders = await Order.find({
    'items.product': { $in: vendorProductIds },
    ...dateFilter,
  }).populate('items.product');

  let totalRevenue = 0;
  let unitsSold = 0;
  const productSales = {}; // To track sales per product
  const salesByDate = {}; // To track sales per day for the chart

  orders.forEach(order => {
    order.items.forEach(item => {
      // Ensure the product belongs to the vendor and is populated
      if (item.product && vendorProductIds.some(id => id.equals(item.product._id))) {
        const revenue = item.quantity * item.product.price;
        totalRevenue += revenue;
        unitsSold += item.quantity;

        // Aggregate product sales
        if (!productSales[item.product._id]) {
          productSales[item.product._id] = {
            id: item.product._id,
            name: item.product.name,
            units: 0,
            revenue: 0,
          };
        }
        productSales[item.product._id].units += item.quantity;
        productSales[item.product._id].revenue += revenue;

        // Aggregate sales by date for the chart
        const orderDate = order.createdAt.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!salesByDate[orderDate]) {
          salesByDate[orderDate] = 0;
        }
        salesByDate[orderDate] += revenue;
      }
    });
  });

  // 4. Format top products
  const topProducts = Object.values(productSales)
    .sort((a, b) => b.units - a.units) // Sort by units sold
    .slice(0, 10); // Get top 10

  // 5. Format sales data for the chart
  const sortedDates = Object.keys(salesByDate).sort();
  const salesData = {
    labels: sortedDates,
    data: sortedDates.map(date => salesByDate[date]),
  };

  res.json({
    totalRevenue,
    unitsSold,
    totalOrders: orders.length,
    topProducts,
    salesData,
  });
});

// @desc    Get all products created by the logged-in vendor
// @route   GET /api/vendor/products
// @access  Private/Vendor
const getVendorProducts = asyncHandler(async (req, res) => {
  // Populate the correct path from schema: 'categories' (array), select only name
  const products = await Product.find({ user: req.user._id }).populate('categories', 'name').populate('variants');
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
    // Simplified update for the whole order
    order.status = 'shipped'; 
    
    await order.save();
    res.json({ message: 'Order item marked as shipped (order status updated to shipped).', order });
  } else {
    res.status(404);
    throw new Error('Product not found in order');
  }
});


module.exports = {
  getVendorDashboardStats,
  getVendorProducts,
  getVendorOrders,
  updateOrderItemToShipped,
};
