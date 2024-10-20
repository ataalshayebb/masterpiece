
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/communityprofilecontroller');
const auth = require('../middlewares/auth'); 

router.get('/info', auth, profileController.getProfileInfo);
router.get('/stats', auth, profileController.getProfileStats);
router.get('/saved-items', auth, profileController.getSavedItems);
router.get('/groups', auth, profileController.getGroups);
router.get('/events', auth, profileController.getEvents);

module.exports = router;