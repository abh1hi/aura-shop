
// File: backend/models/User.js
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
    role: {
      type: String,
      required: [true, 'Please specify a role'],
      enum: ['client', 'influencer', 'admin'],
      default: 'client',
    },
    accountType: {
      type: String,
      enum: ['b2b', 'c2c'],
      // The accountType is only required if the user's role is 'client'
      required: function() {
        return this.role === 'client';
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model('User', userSchema);
