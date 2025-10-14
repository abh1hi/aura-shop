const Product = require('../models/Product');
const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

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

  let category;

  if (newCategoryName) {
    // Vendor is proposing a new category
    // Check if it already exists (case-insensitive)
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${newCategoryName}$`, 'i') } });

    if (existingCategory) {
      // If it exists, use it, but we might want to check its status
      if (existingCategory.status === 'approved') {
        category = existingCategory._id;
      } else {
        // If it's pending, we can either use it or throw an error
        // For now, let's use it, the product will be tied to a pending category
        category = existingCategory._id;
      }
    } else {
      // If it doesn't exist, create it with a 'pending' status
      const newCategory = new Category({
        name: newCategoryName,
        status: 'pending',
      });
      const createdCategory = await newCategory.save();
      category = createdCategory._id;
    }
  } else if (categoryId) {
    // Vendor selected an existing category
    category = categoryId;
  } else {
    res.status(400);
    throw new Error('Please provide a category for the product.');
  }

  const product = new Product({
    name,
    price,
    description,
    imageUrl,
    category,
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
  const { name, price, description, imageUrl, category } = req.body;

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
    product.category = category;

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