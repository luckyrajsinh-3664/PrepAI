const express = require('express');
const router = express.Router();
const { getMarketTrends, getMarketAnalytics } = require('../controllers/marketController');

// Route for MongoDB Market Trends
router.get('/trends', getMarketTrends);

// Route for dynamic Kaggle JSON Analytics (Demand % & Avg Package)
router.get('/analytics', getMarketAnalytics);

module.exports = router;