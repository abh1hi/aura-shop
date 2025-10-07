/*
  File: metainflu/backend/controllers/adminController.js
  Purpose: This file contains the controller functions for admin-specific actions.
  It handles the logic for fetching all users from the database.
*/
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // Find all users and exclude their passwords from the result.
  const users = await User.find({}).select('-password');
  res.json(users);
});

module.exports = {
  getUsers,
};

