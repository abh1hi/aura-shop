
const asyncHandler = require('express-async-handler');
const HeroBanner = require('../models/HeroBanner');
const FeaturedCollection = require('../models/FeaturedCollection');
const ShippingInfo = require('../models/ShippingInfo');

// @desc    Get all hero banners
// @route   GET /api/home/hero-banners
// @access  Public
const getHeroBanners = asyncHandler(async (req, res) => {
    const heroBanners = await HeroBanner.find({});
    res.json(heroBanners);
});

// @desc    Get all featured collections
// @route   GET /api/home/featured-collections
// @access  Public
const getFeaturedCollections = asyncHandler(async (req, res) => {
    const featuredCollections = await FeaturedCollection.find({});
    res.json(featuredCollections);
});

// @desc    Get shipping info
// @route   GET /api/home/shipping-info
// @access  Public
const getShippingInfo = asyncHandler(async (req, res) => {
    const shippingInfo = await ShippingInfo.findOne({});
    res.json(shippingInfo);
});

module.exports = {
    getHeroBanners,
    getFeaturedCollections,
    getShippingInfo,
};
