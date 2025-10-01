// File: backend/controllers/influencerController.js
const Influencer = require('../models/Influencer');
const asyncHandler = require('express-async-handler');

// @desc    Create a new influencer profile
// @route   POST /api/influencers/profile
// @access  Private
const createInfluencerProfile = asyncHandler(async (req, res) => {
  const {
    fullName, phone, location, bio, platforms, profileLinks,
    followerCount, engagementRate, contentCategories, audienceLocation,
    audienceAge, audienceGender, pastCampaigns, averageViews, topContentLinks,
    collaborationType, brandsOfInterest, availability, paymentDetails, taxDetails,
    agreements
  } = req.body;

  // Check if an influencer profile already exists for this user
  const influencerExists = await Influencer.findOne({ user: req.user._id });
  if (influencerExists) {
    res.status(400);
    throw new Error('Influencer profile already exists');
  }

  // Create the new influencer profile
  const influencerProfile = await Influencer.create({
    user: req.user._id,
    fullName,
    phone,
    location,
    bio,
    platforms,
    profileLinks,
    followerCount,
    engagementRate,
    contentCategories,
    audienceLocation,
    audienceAge,
    audienceGender,
    pastCampaigns,
    averageViews,
    topContentLinks,
    collaborationType,
    brandsOfInterest,
    availability,
    paymentDetails,
    taxDetails,
    agreements,
  });

  res.status(201).json(influencerProfile);
});


const getInfluencers = (req, res) => {
  res.status(200).json({ message: 'Influencers list' });
};
const getInfluencerProfile = (req, res) => {
  res.status(200).json({ message: `Influencer profile for ID: ${req.params.id}` });
};
module.exports = {
  getInfluencers,
  getInfluencerProfile,
  createInfluencerProfile,
};
