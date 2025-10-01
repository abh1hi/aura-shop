
// File: backend/models/Payment.js
const mongoose = require('mongoose');
const paymentSchema = mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Campaign',
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
}, { timestamps: true });
module.exports = mongoose.model('Payment', paymentSchema);
