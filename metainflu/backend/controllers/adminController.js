/*
  File: metainflu/backend/controllers/adminController.js
  Purpose: This file contains the controller functions for admin-specific actions.
  It handles the logic for fetching all users from the database.
*/
const User = require('../models/User');
const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Find all users and exclude their passwords from the result.
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get all pending categories
// @route   GET /api/admin/categories/pending
// @access  Private/Admin
const getPendingCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ status: 'pending' });
  res.json(categories);
});

// @desc    Approve a category
// @route   PUT /api/admin/categories/:id/approve
// @access  Private/Admin
const approveCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    category.status = 'approved';
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

// @desc    Reject (delete) a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const rejectCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    // Optional: Before deleting, you might want to handle products that are using this category.
    // For now, we'll just delete the category.
    await category.deleteOne();
    res.json({ message: 'Category rejected and removed' });
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});


module.exports = {
  getUsers,
  getPendingCategories,
  approveCategory,
  rejectCategory,
};