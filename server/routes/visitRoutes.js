const express = require('express');
const router = express.Router();
const { getVisitCount, incrementVisitCount } = require('../controllers/visitController');

// Get current visit count
router.get('/', getVisitCount);

// Increment visit count
router.post('/increment', incrementVisitCount);

module.exports = router; 