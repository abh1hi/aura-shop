const Order = require('../models/Order');
const Cart = require('../models/Cart'); // Import Cart model
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;

  // 1. Fetch the user's cart to get the items and calculate totals on the server
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty. Cannot create an order.');
  }
    
  // 2. Calculate totals (Security: always calculate totals on the backend)
  const orderItems = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      // Store the price at the time of order placement
      price: item.product.price, 
      name: item.product.name,
      imageUrl: item.product.imageUrl,
  }));

  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Simple logic for shipping cost (mimicking frontend logic)
  const shippingCost = subtotal > 100 ? 0 : 10.00;
  const total = subtotal + shippingCost;
    
  // Tax calculation is omitted for simplicity, setting to 0
  const taxPrice = 0; 

  // 3. Create the Order
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    payment: {
        paymentMethod: paymentMethod,
        paymentStatus: 'Pending', // Initial status
    },
    subtotal: subtotal,
    shippingCost: shippingCost,
    total: total,
    status: 'pending',
    // We will use the 'subtotal', 'shippingCost', 'total' fields on the Order model
    itemsPrice: subtotal,
    totalPrice: total,
  });

  const createdOrder = await order.save();
    
  // 4. Clear the cart after successful order creation
  await Cart.findByIdAndDelete(cart._id);

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Ensure only the user who placed the order or an admin/vendor can see it.
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'vendor') {
        res.status(403);
        throw new Error('Not authorized to view this order');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to paid (Marking order as paid after payment processing)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Only the owner of the order should be able to mark it as paid.
    if (order.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to modify this order');
    }

    order.payment.paymentStatus = 'Paid';
    order.isPaid = true;
    order.paidAt = Date.now();
    
    // Simplification: In a real app, this would integrate with a payment gateway response
    order.paymentResult = { 
        id: req.body.id || 'PAYMENT_MOCK_ID', 
        status: 'Paid',
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by newest first
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
// NOTE: This remains primarily for the Admin/Vendor panel access (Vendor logic is in vendorController)
const getOrders = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
      res.status(403);
      throw new Error('Not authorized to view all orders');
  }
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
        res.status(403);
        throw new Error('Not authorized to deliver order');
    }

    order.status = 'delivered';
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders, // Export the new function
  getOrders,
  updateOrderToDelivered,
};
