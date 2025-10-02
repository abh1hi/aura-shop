const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        default: 1,
      },
      size: {
        type: String,
      },
      color: {
        type: String,
      },
    },
  ],
  shippingAddress: {
    fullName: { type: String },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
  payment: {
    paymentMethod: { type: String },
    paymentStatus: { type: String },
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
