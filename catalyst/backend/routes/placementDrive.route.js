const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth.middleware');
const {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  registerForDrive,
  updateSelectedStudents
} = require('../controllers/PlacementDrive/placementDrive.controller');

router.post('/create', authenticateToken, createDrive);
router.get('/all', authenticateToken, getAllDrives);
router.get('/:driveId', authenticateToken, getDriveById);
router.put('/:driveId', authenticateToken, updateDrive);
router.post('/:driveId/register', authenticateToken, registerForDrive);
router.put('/:driveId/selected-students', authenticateToken, updateSelectedStudents);

module.exports = router;

