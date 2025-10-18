/*
  File: metainflu/backend/controllers/authController.js
  Purpose: This file handles user registration and login logic. It exports
  the registerUser, loginUser, and loginAdmin functions. The error was likely
  caused by this file not correctly exporting loginAdmin. This version ensures it is.
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

// Handles new user registration.
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please add all fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Default role is 'user' as defined in the User model.
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    // Return user info, including role, and a token.
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Handles general user login.
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    // Return user info, including role, and a token.
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// Handles admin-specific login.
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists, password is correct, AND user has 'admin' role.
    if (user && (await bcrypt.compare(password, user.password))) {
        if (user.role !== 'admin') {
            res.status(403); // Forbidden
            throw new Error('Not authorized as an admin');
        }
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // Unauthorized
        throw new Error('Invalid credentials');
    }
});


// Handles vendor-specific login.
const loginVendor = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    if (user.role !== 'vendor') {
        res.status(403);
        throw new Error('Not authorized as a vendor');
    }

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
});

module.exports = {
  registerUser,
  loginUser,
  loginAdmin, // This line is crucial and ensures loginAdmin is exported.
  loginVendor,
};

