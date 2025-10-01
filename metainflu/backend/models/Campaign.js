
// File: backend/models/Campaign.js
const mongoose = require('mongoose');
const campaignSchema = mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Influencer',
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });
module.exports = mongoose.model('Campaign', campaignSchema);

