// routes/profile.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profilecontroller');
const auth = require('../middlewares/auth');

// Get user profile
router.get('/user', auth, profileController.getUserProfile);

// Update user profile
router.put('/user', auth, profileController.updateUserProfile);

module.exports = router;