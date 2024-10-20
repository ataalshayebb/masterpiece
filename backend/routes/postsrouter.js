const express = require('express');
const router = express.Router();
const postController = require('../controllers/postscontroller');
const authMiddleware = require('../middlewares/auth'); // Assuming you have this middleware
const { getSavedItems } = require('../controllers/communityprofilecontroller');

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getPosts);
router.post('/:id/save',authMiddleware, postController.savePost);
router.get('/saved', authMiddleware,postController.getSavedPosts);

router.post('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/comment', authMiddleware, postController.commentOnPost);




module.exports = router;