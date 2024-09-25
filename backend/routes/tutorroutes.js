// routes/aiTutorRouter.js
const express = require('express');
const { handleAITutor } = require('../controllers/tutorcontroller');

const router = express.Router();

router.post('/ai-tutor', handleAITutor);

module.exports = router;
