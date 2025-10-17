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
  const products = await Product.find(filter).populate('categories', 'name').populate('variants'); 
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
  const { name, price, description, imageUrl, stock, category, newCategoryName } = req.body;

  let categoryIdToUse;

  if (newCategoryName) {
    const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${newCategoryName}$`, 'i') } });

    if (existingCategory) {
      categoryIdToUse = existingCategory._id;
    } else {
      const newCategory = new Category({
        name: newCategoryName,
        status: 'pending',
      });
      const createdCategory = await newCategory.save();
      categoryIdToUse = createdCategory._id;
    }
  } else if (category) {
    categoryIdToUse = category;
  } else {
    res.status(400);
    throw new Error('Please provide a category for the product.');
  }

  const product = new Product({
    name,
    description,
    images: [{ url: imageUrl, altText: name, position: 1 }],
    categories: [categoryIdToUse],
    user: req.user._id,
    variants: [
      {
        price,
        stock,
        sku: `${name.replace(/\s+/g, '-')}-${Date.now()}`
      }
    ]
  });

  const createdProduct = await product.save();
  const populatedProduct = await Product.findById(createdProduct._id).populate('categories', 'name');

  res.status(201).json(populatedProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin (or Vendor - must own product)
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Security Check
  if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this product');
  }

  // Update whitelisted fields
  const allowedUpdates = [
    'name', 'description', 'brand', 'modelNumber', 'gtin', 'categories', 
    'attributes', 'arrayAttributes', 'variants', 'images', 'weight', 
    'dimensions', 'pattern', 'style', 'ageGroup', 'gender', 'releaseYear', 
    'season', 'careInstructions', 'warranty', 'sustainability', 
    'certifications', 'power', 'technicalSpecs', 'ingredients', 
    'expirationDate', 'safetyWarnings', 'inTheBox', 'bundleContents', 
    'regionOfOrigin', 'tags'
  ];

  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      product[key] = updateData[key];
    }
  });

  // Synchronize variant images from the main images list
  if (product.images && product.variants) {
    const skuToVariantMap = new Map();
    product.variants.forEach(variant => {
      if (variant.sku) {
        skuToVariantMap.set(variant.sku, variant);
      }
      // Reset the variant's images array before repopulating
      variant.images = []; 
    });

    product.images.forEach(image => {
      if (image.variantSku && skuToVariantMap.has(image.variantSku)) {
        const variant = skuToVariantMap.get(image.variantSku);
        if (variant) {
          if (!variant.images) {
            variant.images = [];
          }
          variant.images.push(image.url);
        }
      }
    });
  }

  const updatedProduct = await product.save();
  const populatedProduct = await Product.findById(updatedProduct._id).populate('categories', 'name');

  res.json(populatedProduct);
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
