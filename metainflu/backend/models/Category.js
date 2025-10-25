const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParentCategory',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved'],
    default: 'approved',
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model('Category', categorySchema);