const mongoose = require('mongoose');

const parentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
}, {
  timestamps: true,
});

const ParentCategory = mongoose.model('ParentCategory', parentCategorySchema);

module.exports = ParentCategory;
