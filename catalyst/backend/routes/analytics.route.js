const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const { getDashboardStats } = require('../controllers/Analytics/dashboard.controller');

router.get('/dashboard', authenticateToken, getDashboardStats);

module.exports = router;

