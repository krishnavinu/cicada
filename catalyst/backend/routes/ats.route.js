const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const {
  validateATSFormat,
  extractKeywords
} = require('../controllers/ResumeBuilder/ats-validator.controller');

router.post('/validate', authenticateToken, validateATSFormat);
router.post('/extract-keywords', authenticateToken, extractKeywords);

module.exports = router;

