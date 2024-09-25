const express = require('express');
const router = express.Router();
const postController = require('../controllers/postscontroller');
const authMiddleware = require('../middlewares/auth'); // Assuming you have this middleware

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getPosts);
router.post('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/comment', authMiddleware, postController.commentOnPost);

module.exports = router;