const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
      // Legacy fields for backward compatibility
      size: {
        type: String,
      },
      color: {
        type: String,
      },
      // Enhanced variant support
      variantId: {
        type: String, // Can be ObjectId or SKU
      },
      variant: {
        type: mongoose.Schema.Types.Mixed, // Flexible object to store variant data
      }
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);