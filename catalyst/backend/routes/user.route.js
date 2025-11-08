const express = require('express');

// router after /user/
const router = express.Router();

// import multer for user profile update 
const upload = require('../config/Multer.js');

const authenticateToken = require('../middleware/auth.middleware');

// users controller methods
const UserDetail = require('../controllers/user/user.detail.controller.js');
const AllUsersLen = require('../controllers/user/user.all-users.controller.js');
const UpdatePhoto = require('../controllers/user/user.update-photo.controller.js');
const UpdateProfile = require('../controllers/user/user.update-profile.controller.js');
const UpdatePassword = require('../controllers/user/user.update-password.js');
const UserData = require('../controllers/user/user.show-data.js');
const { completeTutorial, skipTutorial } = require('../controllers/User/tutorial.controller');

// details of users student
router.get('/detail', authenticateToken, UserDetail);

// all user in lenght 
router.get('/all-users', authenticateToken, AllUsersLen);

router.get('/:userId', authenticateToken, UserData);

router.post('/upload-photo', upload.single('profileImgs'), UpdatePhoto);

router.post('/update-profile', authenticateToken, UpdateProfile);

router.post('/change-password', authenticateToken, UpdatePassword);

// Tutorial routes
router.patch('/tutorial/complete', authenticateToken, completeTutorial);
router.patch('/tutorial/skip', authenticateToken, skipTutorial);

module.exports = router;