const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');

const HODLogin = require('../controllers/HOD/hod.login.controller');
const {
  getUnapprovedStudents,
  approveStudent,
  rejectStudent,
  getDepartmentStudents,
  updateStudentProfile
} = require('../controllers/HOD/hod.student-approval.controller');
const {
  getDepartmentStats
} = require('../controllers/HOD/hod.dashboard.controller');

// HOD Login
router.post('/login', HODLogin);

// HOD Dashboard
router.get('/dashboard/stats', authenticateToken, getDepartmentStats);

// Student Management
router.get('/students/unapproved', authenticateToken, getUnapprovedStudents);
router.get('/students', authenticateToken, getDepartmentStudents);
router.post('/students/approve', authenticateToken, approveStudent);
router.post('/students/reject', authenticateToken, rejectStudent);
router.put('/students/:studentId', authenticateToken, updateStudentProfile);

module.exports = router;

