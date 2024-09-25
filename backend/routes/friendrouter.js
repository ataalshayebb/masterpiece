// routes/friendRouter.js
const express = require('express');
const router = express.Router();
const friendController = require('../controllers/friendcontroller');
const auth = require('../middlewares/auth');

router.post('/send-request', auth, friendController.sendFriendRequest);
router.post('/accept-request', auth, friendController.acceptFriendRequest);
router.post('/reject-request', auth, friendController.rejectFriendRequest);
router.post('/remove-friend', auth, friendController.removeFriend);
router.get('/friends', auth, friendController.getFriends);
router.get('/friend-requests', auth, friendController.getFriendRequests);
router.get('/sent-requests', auth, friendController.getSentRequests);
router.get('/suggestions', auth, friendController.getUserSuggestions);

module.exports = router;