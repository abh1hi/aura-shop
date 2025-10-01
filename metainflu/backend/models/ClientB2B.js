
// File: backend/models/ClientB2B.js
const mongoose = require('mongoose');

const clientB2BSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: String,
    industry: String,
    website: String,
    businessEmail: String,
    contactNumber: String,
    businessAddress: String,
    preferredInfluencerType: String,
    campaignGoals: String,
    budgetRange: String,
    gstVat: String,
    paymentPreferences: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('ClientB2B', clientB2BSchema);

