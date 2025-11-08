const express = require('express');
const router = express.Router();

const { AllJobs, JobData } = require('../controllers/user/user.all-jobs.controller');

// Public routes (no authentication required)
router.get('/jobs', AllJobs);
router.get('/job/:jobId', JobData);

module.exports = router;

