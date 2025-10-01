// File: backend/routes/influencerRoutes.js
const express = require('express');
const router = express.Router();
const { getInfluencers, getInfluencerProfile, createInfluencerProfile } = require('../controllers/influencerController');
const { protect } = require('../middleware/authMiddleware');

// Define a protected route to create an influencer profile
router.post('/profile', protect, createInfluencerProfile);

router.get('/', getInfluencers);
router.get('/:id', getInfluencerProfile);
module.exports = router;
