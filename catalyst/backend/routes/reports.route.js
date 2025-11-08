const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const {
  getDepartmentWiseReport,
  getOfferWiseReport,
  getStudentWiseReport,
  exportDepartmentReportExcel,
  exportDepartmentReportPDF
} = require('../controllers/Reports/reports.controller');

router.get('/department', authenticateToken, getDepartmentWiseReport);
router.get('/department/export/excel', authenticateToken, exportDepartmentReportExcel);
router.get('/department/export/pdf', authenticateToken, exportDepartmentReportPDF);
router.get('/offers', authenticateToken, getOfferWiseReport);
router.get('/student/:studentId', authenticateToken, getStudentWiseReport);

module.exports = router;

