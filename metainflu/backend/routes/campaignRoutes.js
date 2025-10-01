
// File: backend/routes/campaignRoutes.js

const express = require('express');
const router = express.Router();
const { createCampaign, getCampaigns } = require('../controllers/campaignController');

// Define routes for campaign-related actions
router.post('/', createCampaign);
router.get('/', getCampaigns);

module.exports = router;

