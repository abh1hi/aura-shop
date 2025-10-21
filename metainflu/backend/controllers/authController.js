/*
  File: metainflu/backend/controllers/authController.js
  Purpose: This file handles user registration and login logic. It exports
  the registerUser, loginUser, and loginAdmin functions.
  Updated with enhanced error handling and CORS support.
*/
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Generates a JWT token for a given user ID.
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Validates email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validates password strength
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Handles new user registration.
const registerUser = asyncHandler(async (req, res) => {
  console.log('Registration attempt:', {
    body: req.body,
    headers: req.headers,
    method: req.method,
    origin: req.headers.origin
  });

  const { name, email, password, role = 'user' } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    console.log('Registration failed: Missing fields');
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields',
      fields: {
        name: !name ? 'Name is required' : null,
        email: !email ? 'Email is required' : null,
        password: !password ? 'Password is required' : null
      }
    });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    console.log('Registration failed: Invalid email format');
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }

  // Validate password strength
  if (!isValidPassword(password)) {
    console.log('Registration failed: Weak password');
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.log('Registration failed: User already exists');
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Validate role
    const allowedRoles = ['user', 'vendor', 'admin'];
    const userRole = allowedRoles.includes(role) ? role : 'user';

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole
    });

    if (user) {
      console.log('User registered successfully:', user.email);
      
      // Set CORS headers explicitly
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        }
      });
    } else {
      console.log('Registration failed: User creation failed');
      res.status(500).json({
        success: false,
        message: 'Failed to create user account'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Handles general user login.
const loginUser = asyncHandler(async (req, res) => {
  console.log('Login attempt:', {
    email: req.body.email,
    origin: req.headers.origin
  });

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('User logged in successfully:', user.email);
      
      // Set CORS headers explicitly
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        }
      });
    } else {
      console.log('Login failed: Invalid credentials');
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// Handles admin-specific login.
const loginAdmin = asyncHandler(async (req, res) => {
  console.log('Admin login attempt:', {
    email: req.body.email,
    origin: req.headers.origin
  });

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.role !== 'admin') {
        console.log('Admin login failed: User is not admin');
        return res.status(403).json({
          success: false,
          message: 'Access denied. Admin privileges required.'
        });
      }
      
      console.log('Admin logged in successfully:', user.email);
      
      res.json({
        success: true,
        message: 'Admin login successful',
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        }
      });
    } else {
      console.log('Admin login failed: Invalid credentials');
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin login'
    });
  }
});

// Handles vendor-specific login.
const loginVendor = asyncHandler(async (req, res) => {
  console.log('Vendor login attempt:', {
    email: req.body.email,
    origin: req.headers.origin
  });

  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log('Vendor login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Vendor login failed: Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.role !== 'vendor') {
      console.log('Vendor login failed: User is not vendor');
      return res.status(403).json({
        success: false,
        message: 'Access denied. Vendor privileges required.'
      });
    }

    console.log('Vendor logged in successfully:', user.email);
    
    res.json({
      success: true,
      message: 'Vendor login successful',
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      }
    });
  } catch (error) {
    console.error('Vendor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during vendor login'
    });
  }
});

// Get current user profile
const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  loginVendor,
  getProfile
};