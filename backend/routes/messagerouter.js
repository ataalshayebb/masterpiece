// routes/messageRouter.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messagecontroller');
const auth = require('../middlewares/auth');

router.get('/', auth, messageController.getMessages);
router.post('/', auth, messageController.createMessage);

module.exports = router;