const asyncHandler = require('express-async-handler');
const HeroBanner = require('../models/HeroBanner');
const FeaturedCollection = require('../models/FeaturedCollection');
const ShippingInfo = require('../models/ShippingInfo');

// ===========================================
// HERO BANNERS CRUD OPERATIONS
// ===========================================

// @desc    Get all hero banners (sorted by priority and creation date)
// @route   GET /api/home/hero-banners
// @access  Public
const getHeroBanners = asyncHandler(async (req, res) => {
    const heroBanners = await HeroBanner.find({})
        .sort({ priority: -1, createdAt: -1 }); // Higher priority first, then newest
    res.json(heroBanners);
});

// @desc    Create a new hero banner
// @route   POST /api/home/hero-banners
// @access  Admin only
const createHeroBanner = asyncHandler(async (req, res) => {
    const { title, subtitle, imageUrl, link, priority, active } = req.body;

    // Validation
    if (!title || !imageUrl) {
        res.status(400);
        throw new Error('Title and image URL are required');
    }

    const heroBanner = await HeroBanner.create({
        title: title.trim(),
        subtitle: subtitle ? subtitle.trim() : '',
        imageUrl: imageUrl.trim(),
        link: link ? link.trim() : '',
        priority: priority || 0,
        active: active !== undefined ? active : true
    });

    res.status(201).json(heroBanner);
});

// @desc    Update a hero banner
// @route   PUT /api/home/hero-banners/:id
// @access  Admin only
const updateHeroBanner = asyncHandler(async (req, res) => {
    const heroBanner = await HeroBanner.findById(req.params.id);

    if (!heroBanner) {
        res.status(404);
        throw new Error('Hero banner not found');
    }

    const { title, subtitle, imageUrl, link, priority, active } = req.body;

    // Validation
    if (title && !title.trim()) {
        res.status(400);
        throw new Error('Title cannot be empty');
    }
    if (imageUrl && !imageUrl.trim()) {
        res.status(400);
        throw new Error('Image URL cannot be empty');
    }

    // Update fields
    heroBanner.title = title ? title.trim() : heroBanner.title;
    heroBanner.subtitle = subtitle !== undefined ? subtitle.trim() : heroBanner.subtitle;
    heroBanner.imageUrl = imageUrl ? imageUrl.trim() : heroBanner.imageUrl;
    heroBanner.link = link !== undefined ? link.trim() : heroBanner.link;
    heroBanner.priority = priority !== undefined ? priority : heroBanner.priority;
    heroBanner.active = active !== undefined ? active : heroBanner.active;

    const updatedHeroBanner = await heroBanner.save();
    res.json(updatedHeroBanner);
});

// @desc    Delete a hero banner
// @route   DELETE /api/home/hero-banners/:id
// @access  Admin only
const deleteHeroBanner = asyncHandler(async (req, res) => {
    const heroBanner = await HeroBanner.findById(req.params.id);

    if (!heroBanner) {
        res.status(404);
        throw new Error('Hero banner not found');
    }

    await HeroBanner.findByIdAndDelete(req.params.id);
    res.json({ message: 'Hero banner deleted successfully' });
});

// ===========================================
// FEATURED COLLECTIONS CRUD OPERATIONS
// ===========================================

// @desc    Get all featured collections (sorted by priority and creation date)
// @route   GET /api/home/featured-collections
// @access  Public
const getFeaturedCollections = asyncHandler(async (req, res) => {
    const featuredCollections = await FeaturedCollection.find({})
        .sort({ priority: -1, createdAt: -1 }); // Higher priority first, then newest
    res.json(featuredCollections);
});

// @desc    Create a new featured collection
// @route   POST /api/home/featured-collections
// @access  Admin only
const createFeaturedCollection = asyncHandler(async (req, res) => {
    const { title, description, imageUrl, category, productIds, priority, active } = req.body;

    // Validation
    if (!title || !imageUrl) {
        res.status(400);
        throw new Error('Title and image URL are required');
    }

    // Process productIds if provided
    let processedProductIds = [];
    if (productIds && Array.isArray(productIds)) {
        processedProductIds = productIds.filter(id => id && id.trim()).map(id => id.trim());
    }

    const featuredCollection = await FeaturedCollection.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        imageUrl: imageUrl.trim(),
        category: category ? category.trim() : '',
        productIds: processedProductIds,
        priority: priority || 0,
        active: active !== undefined ? active : true
    });

    res.status(201).json(featuredCollection);
});

// @desc    Update a featured collection
// @route   PUT /api/home/featured-collections/:id
// @access  Admin only
const updateFeaturedCollection = asyncHandler(async (req, res) => {
    const featuredCollection = await FeaturedCollection.findById(req.params.id);

    if (!featuredCollection) {
        res.status(404);
        throw new Error('Featured collection not found');
    }

    const { title, description, imageUrl, category, productIds, priority, active } = req.body;

    // Validation
    if (title && !title.trim()) {
        res.status(400);
        throw new Error('Title cannot be empty');
    }
    if (imageUrl && !imageUrl.trim()) {
        res.status(400);
        throw new Error('Image URL cannot be empty');
    }

    // Process productIds if provided
    let processedProductIds = featuredCollection.productIds;
    if (productIds !== undefined) {
        if (Array.isArray(productIds)) {
            processedProductIds = productIds.filter(id => id && id.trim()).map(id => id.trim());
        } else {
            processedProductIds = [];
        }
    }

    // Update fields
    featuredCollection.title = title ? title.trim() : featuredCollection.title;
    featuredCollection.description = description !== undefined ? description.trim() : featuredCollection.description;
    featuredCollection.imageUrl = imageUrl ? imageUrl.trim() : featuredCollection.imageUrl;
    featuredCollection.category = category !== undefined ? category.trim() : featuredCollection.category;
    featuredCollection.productIds = processedProductIds;
    featuredCollection.priority = priority !== undefined ? priority : featuredCollection.priority;
    featuredCollection.active = active !== undefined ? active : featuredCollection.active;

    const updatedFeaturedCollection = await featuredCollection.save();
    res.json(updatedFeaturedCollection);
});

// @desc    Delete a featured collection
// @route   DELETE /api/home/featured-collections/:id
// @access  Admin only
const deleteFeaturedCollection = asyncHandler(async (req, res) => {
    const featuredCollection = await FeaturedCollection.findById(req.params.id);

    if (!featuredCollection) {
        res.status(404);
        throw new Error('Featured collection not found');
    }

    await FeaturedCollection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Featured collection deleted successfully' });
});

// ===========================================
// SHIPPING INFO (EXISTING)
// ===========================================

// @desc    Get shipping info
// @route   GET /api/home/shipping-info
// @access  Public
const getShippingInfo = asyncHandler(async (req, res) => {
    const shippingInfo = await ShippingInfo.findOne({});
    res.json(shippingInfo);
});

module.exports = {
    // Hero Banners
    getHeroBanners,
    createHeroBanner,
    updateHeroBanner,
    deleteHeroBanner,
    
    // Featured Collections
    getFeaturedCollections,
    createFeaturedCollection,
    updateFeaturedCollection,
    deleteFeaturedCollection,
    
    // Shipping Info
    getShippingInfo,
};