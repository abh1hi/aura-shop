
// File: backend/models/Influencer.js
const mongoose = require('mongoose');
const influencerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    fullName: String,
    phone: String,
    location: String,
    bio: String,
    profilePicture: String,
    platforms: {
      type: [String],
      enum: ['Instagram', 'YouTube', 'TikTok', 'Facebook'],
    },
    profileLinks: String,
    followerCount: Number,
    engagementRate: Number,
    contentCategories: String,
    audienceLocation: String,
    audienceAge: String,
    audienceGender: String,
    pastCampaigns: String,
    averageViews: String,
    topContentLinks: String,
    collaborationType: String,
    brandsOfInterest: String,
    availability: String,
    paymentDetails: String,
    taxDetails: String,
    agreements: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Influencer', influencerSchema);

