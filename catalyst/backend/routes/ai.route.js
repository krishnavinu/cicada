const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const upload = require('../config/Multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const { generateEmailTemplate } = require('../controllers/AI/email-generator.controller');
const { parseResume } = require('../controllers/AI/resume-parser.controller');
const { filterResumes } = require('../controllers/AI/resume-filter.controller');
const { summarizePlacementResults } = require('../controllers/AI/summarize-results.controller');
const {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getSessionDetails
} = require('../controllers/AI/interview-simulator.controller');
const {
  predictPlacement,
  getPrediction,
  getUserPredictions
} = require('../controllers/AI/predictive-analytics.controller');
const {
  calculatePRS,
  getPRS,
  getAllStudentsPRS,
  updateAttendance
} = require('../controllers/AI/prs.controller');
const {
  matchJobsToCandidate,
  matchCandidatesToJob,
  getJobMatch
} = require('../controllers/AI/semantic-matching.controller');
const {
  getRecommendedInterventions,
  simulateIntervention,
  createIntervention,
  completeIntervention,
  getInterventionHistory
} = require('../controllers/AI/intervention-engine.controller');
const {
  analyzeCareerDNA,
  getCareerDNA,
  matchCulture
} = require('../controllers/AI/career-dna.controller');

// AI Email Generation
router.post('/email/generate', authenticateToken, generateEmailTemplate);

// Resume Parsing
router.post('/resume/parse', authenticateToken, upload.single('resume'), parseResume);

// Resume Filtering
router.post('/resume/filter', authenticateToken, filterResumes);

// Placement Results Summary
router.get('/summarize-results', authenticateToken, summarizePlacementResults);

// AI Interview Simulator
router.post('/interview/start', authenticateToken, startInterview);
router.post('/interview/answer', authenticateToken, submitAnswer);
router.post('/interview/complete', authenticateToken, completeInterview);
router.get('/interview/history', authenticateToken, getInterviewHistory);
router.get('/interview/session/:sessionId', authenticateToken, getSessionDetails);

// Predictive Analytics
router.post('/predict', authenticateToken, predictPlacement);
router.get('/predict/:jobId', authenticateToken, getPrediction);
router.get('/predictions', authenticateToken, getUserPredictions);

// Placement Readiness Score (PRS)
router.post('/prs/calculate', authenticateToken, calculatePRS);
router.get('/prs', authenticateToken, getPRS);
router.get('/prs/all', authenticateToken, getAllStudentsPRS);
router.post('/prs/attendance', authenticateToken, updateAttendance);

// Semantic Job Matching
router.get('/match/jobs', authenticateToken, matchJobsToCandidate);
router.get('/match/job/:jobId', authenticateToken, getJobMatch);
router.get('/match/candidates/:jobId', authenticateToken, matchCandidatesToJob);

// Intervention Engine
router.get('/interventions/recommendations', authenticateToken, getRecommendedInterventions);
router.post('/interventions/simulate', authenticateToken, simulateIntervention);
router.post('/interventions', authenticateToken, createIntervention);
router.post('/interventions/:interventionId/complete', authenticateToken, completeIntervention);
router.get('/interventions/history', authenticateToken, getInterventionHistory);

// Career DNA Profiler
router.post('/career-dna/analyze', authenticateToken, analyzeCareerDNA);
router.get('/career-dna', authenticateToken, getCareerDNA);
router.get('/career-dna/match/:jobId', authenticateToken, matchCulture);

module.exports = router;

