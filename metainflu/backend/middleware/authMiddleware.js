/*
  File: metainflu/backend/middleware/authMiddleware.js
  Purpose: This file contains Express middleware for authentication and authorization.
  'protect' verifies the JWT, 'admin' checks for admin role, and 'vendor' checks for vendor role.
*/
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware to protect routes by verifying a JWT.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach the user (excluding password) to the request object
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Middleware to check if the user is an admin.
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// Middleware to check if the user is a vendor.
const vendor = (req, res, next) => {
  if (req.user && req.user.role === 'vendor') {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as a vendor');
  }
};

module.exports = { protect, admin, vendor };
