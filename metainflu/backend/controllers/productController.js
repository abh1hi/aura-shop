const Product = require('../models/Product');
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
// @access  Private/Admin (or Vendor who is protected by admin or vendor middleware)
const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, imageUrl, category } = req.body;
  
  // NOTE: This endpoint is currently protected by `protect, admin` middleware in productRoutes.js.
  // For simplicity, we assume this is the admin endpoint for now.
  // If we want vendors to use this, the route protection should be updated, and we must ensure
  // the `user` field is set to the currently logged-in user (req.user._id).
  
  // For the purpose of enabling the Vendor Panel, we enforce the owner to be the logged-in user.
  const product = new Product({
    name,
    price,
    description,
    imageUrl,
    category,
    user: req.user._id, // Assign the logged-in user (vendor/admin) as the product owner
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
