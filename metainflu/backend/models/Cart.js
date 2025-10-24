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
      size: {
        type: String,
      },
      color: {
        type: String,
      },
      variant: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
