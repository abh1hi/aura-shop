
// File: backend/models/ClientC2C.js
const mongoose = require('mongoose');

const clientC2CSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: String,
    socialMedia: String,
    campaignObjective: String,
    budgetRange: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClientC2C', clientC2CSchema);
