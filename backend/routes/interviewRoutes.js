const express = require('express');
const router = express.Router();
const { startInterview, submitAnswer, getResults, getHistory, getCurrentInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startInterview);
router.post('/submit', protect, submitAnswer);
router.get('/results/:attemptId', protect, getResults);
router.get('/history', protect, getHistory);
router.get('/current', protect, getCurrentInterview);

module.exports = router;