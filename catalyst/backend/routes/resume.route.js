const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const {
  getResume,
  saveResume,
  getAISuggestions,
  getSkillSuggestions,
  scoreResume,
  exportPDF,
  submitToJob
} = require('../controllers/ResumeBuilder/resume.controller');

router.get('/get', authenticateToken, getResume);
router.post('/save', authenticateToken, saveResume);
router.post('/ai-suggestions', authenticateToken, getAISuggestions);
router.post('/ai-skill-suggestions', authenticateToken, getSkillSuggestions);
router.post('/ai-score', authenticateToken, scoreResume);
router.get('/export-pdf', authenticateToken, exportPDF);
router.post('/submit-to-job', authenticateToken, submitToJob);

module.exports = router;

