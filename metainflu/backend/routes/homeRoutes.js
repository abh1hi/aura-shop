const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/homeController');

const { protect, admin } = require('../middleware/authMiddleware');

// ===========================================
// HERO BANNERS ROUTES
// ===========================================

// Public routes (no authentication required)
router.route('/hero-banners')
    .get(getHeroBanners)                    // GET /api/home/hero-banners
    .post(protect, admin, createHeroBanner); // POST /api/home/hero-banners (Admin only)

// Admin routes (authentication required)
router.route('/hero-banners/:id')
    .put(protect, admin, updateHeroBanner)   // PUT /api/home/hero-banners/:id (Admin only)
    .delete(protect, admin, deleteHeroBanner); // DELETE /api/home/hero-banners/:id (Admin only)

// ===========================================
// FEATURED COLLECTIONS ROUTES
// ===========================================

// Public routes (no authentication required)
router.route('/featured-collections')
    .get(getFeaturedCollections)                    // GET /api/home/featured-collections
    .post(protect, admin, createFeaturedCollection); // POST /api/home/featured-collections (Admin only)

// Admin routes (authentication required)
router.route('/featured-collections/:id')
    .put(protect, admin, updateFeaturedCollection)   // PUT /api/home/featured-collections/:id (Admin only)
    .delete(protect, admin, deleteFeaturedCollection); // DELETE /api/home/featured-collections/:id (Admin only)

// ===========================================
// SHIPPING INFO ROUTES (EXISTING)
// ===========================================

// Public route
router.route('/shipping-info')
    .get(getShippingInfo); // GET /api/home/shipping-info

module.exports = router;