const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  // NEW: Link product to the user (vendor) who created it.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, // A product must belong to a user/vendor
  },
});

module.exports = mongoose.model('Product', productSchema);
