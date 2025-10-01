

// File: backend/controllers/authController.js
const User = require('../models/User');
const ClientB2B = require('../models/ClientB2B');
const ClientC2C = require('../models/ClientC2C');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, accountType } = req.body;
  if (!name || !email || !password || !role) {
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
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    accountType,
  });
  if (user) {
    // Create a corresponding client profile based on accountType
    if (user.role === 'client') {
      if (user.accountType === 'b2b') {
        await ClientB2B.create({ user: user._id, companyName: user.name });
      } else if (user.accountType === 'c2c') {
        await ClientC2C.create({ user: user._id, fullName: user.name });
      }
    }
    
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
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
module.exports = {
  registerUser,
  loginUser,
};
