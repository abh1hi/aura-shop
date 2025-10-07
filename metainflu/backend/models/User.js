/*
  File: metainflu/backend/models/User.js
  Purpose: This file defines the Mongoose schema for the User model.
  It includes fields for name, email, password, and a new 'role' field
  to distinguish between regular users and administrators.
*/
const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    // New 'role' field to differentiate users.
    role: {
      type: String,
      required: true,
      default: 'user', // Defaults to 'user'. Can be manually set to 'admin' in the database.
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);

