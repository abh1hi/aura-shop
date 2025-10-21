/*
  File: metainflu/backend/middleware/authMiddleware.js
  Purpose: This file contains Express middleware for authentication and authorization.
  'protect' verifies the JWT, 'admin' checks for admin role, and 'vendor' checks for vendor role.
  Updated to properly handle CORS preflight OPTIONS requests.
*/
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware to protect routes by verifying a JWT.
const protect = asyncHandler(async (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Attach the user (excluding password) to the request object
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }
});

// Optional auth middleware - allows requests with or without token
const optionalAuth = asyncHandler(async (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.error('Optional token verification failed:', error.message);
      // Don't throw error, just continue without user
      req.user = null;
    }
  }
  
  next();
});

// Middleware to check if the user is an admin.
const admin = (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

// Middleware to check if the user is a vendor.
const vendor = (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (req.user && req.user.role === 'vendor') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a vendor');
  }
};

// Middleware to check if user has any of the specified roles
const authorize = (...roles) => {
  return (req, res, next) => {
    // Allow OPTIONS requests to pass through for CORS preflight
    if (req.method === 'OPTIONS') {
      return next();
    }

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, please login');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Not authorized. Required roles: ${roles.join(', ')}`);
    }

    next();
  };
};

// Middleware for routes that require authentication but allow any role
const authenticated = (req, res, next) => {
  // Allow OPTIONS requests to pass through for CORS preflight
  if (req.method === 'OPTIONS') {
    return next();
  }

  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized, please login');
  }

  next();
};

module.exports = { 
  protect, 
  optionalAuth,
  admin, 
  vendor, 
  authorize,
  authenticated
};