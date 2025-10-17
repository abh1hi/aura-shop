const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Import mongoose for ObjectId check

// @desc    Fetch all products, optionally filtered by category
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const categoryId = req.query.category; 

  const filter = {};

  // Check if a category filter was provided
  if (categoryId && categoryId !== 'All') {
    // Validate the ID format before querying the DB to prevent internal server errors
    if (mongoose.Types.ObjectId.isValid(categoryId)) {
        // Find products where the categories array contains the requested categoryId
        filter.categories = categoryId; 
    } else {
        // If the ID is invalid, set a filter that returns nothing
        res.status(400);
        throw new Error('Invalid category ID format.');
    }
  }

  // Execute the query, populating the first category's name for display
  // Using .find(filter) applies the filter only if it has properties (which it won't if categoryId is null)
  const products = await Product.find(filter).populate('categories', 'name'); 
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  // Populate category data when fetching a single product
  const product = await Product.findById(req.params.id).populate('categories', 'name');

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Vendor
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, stock, category: categoryId, newCategoryName } = req.body;

  let categoryIdToUse;

  if (newCategoryName) {
    // Vendor is proposing a new category (logic remains the same)
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${newCategoryName}$`, 'i') } });

    if (existingCategory) {
      // Use existing category ID
      categoryIdToUse = existingCategory._id;
    } else {
      // Create new category with 'pending' status
      const newCategory = new Category({
        name: newCategoryName,
        status: 'pending',
      });
      const createdCategory = await newCategory.save();
      categoryIdToUse = createdCategory._id;
    }
  } else if (categoryId) {
    // Vendor selected an existing category
    categoryIdToUse = categoryId;
  } else {
    res.status(400);
    throw new Error('Please provide a category for the product.');
  }

  const product = new Product({
    name,
    price,
    description,
    imageUrl,
    // FIX: Ensure category is stored in the 'categories' array field as per Product model schema
    categories: [categoryIdToUse], 
    stock,
    user: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin (or Vendor - must own product)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, categories } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Security Check: Only the owner (vendor) or an admin can update the product
    if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to update this product');
    }
    
    product.name = name;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;
    // FIX: Update to use 'categories' field, expecting an array of IDs from the frontend
    product.categories = categories; 

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin (or Vendor - must own product)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
     // Security Check: Only the owner (vendor) or an admin can delete the product
    if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this product');
    }
    
    await product.deleteOne(); // Use deleteOne() instead of deprecated remove()
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
