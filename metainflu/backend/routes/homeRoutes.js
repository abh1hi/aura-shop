
const express = require('express');
const router = express.Router();
const {
    getHeroBanners,
    getFeaturedCollections,
    getShippingInfo,
} = require('../controllers/homeController');

router.route('/hero-banners').get(getHeroBanners);
router.route('/featured-collections').get(getFeaturedCollections);
router.route('/shipping-info').get(getShippingInfo);
module.exports = router;
