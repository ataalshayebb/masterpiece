const Post = require('../models/posts');
const multer = require('multer');
const path = require('path');
const User = require('../models/users')
// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.createPost = [upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    const newPost = new Post({
      userId,
      content,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
}];

exports.getPosts = async (req, res) => {
  try {
    const { sort } = req.query;
    let posts;

    console.log(`Received sort parameter: ${sort}`); // Debugging log

    switch (sort) {
      case 'likes':
        posts = await Post.aggregate([
          {
            $addFields: {
              likesCount: { $size: "$likes" }
            }
          },
          { $sort: { likesCount: -1, createdAt: -1 } }
        ]);
        break;
      case 'comments':
        posts = await Post.aggregate([
          {
            $addFields: {
              commentsCount: { $size: "$comments" }
            }
          },
          { $sort: { commentsCount: -1, createdAt: -1 } }
        ]);
        break;
      case 'recent':
      default:
        posts = await Post.find().sort({ createdAt: -1 });
    }

    // Populate user and comment information
    posts = await Post.populate(posts, [
      { path: 'userId', select: 'username image' },
      { path: 'comments.userId', select: 'username image' }
    ]);

    console.log(`Returning ${posts.length} posts`); // Debugging log

    res.json(posts);
  } catch (error) {
    console.error('Error in getPosts:', error); // Debugging log
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};


exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error: error.message });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ userId, comment });
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error commenting on post', error: error.message });
  }
};


exports.savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // Assuming you have user information in the request

    const user = await User.findById(userId);
    const postIndex = user.savedposts.findIndex(
      (savedPost) => savedPost.postId.toString() === postId
    );

    if (postIndex > -1) {
      // Post is already saved, so remove it
      user.savedposts.splice(postIndex, 1);
      await user.save();
      res.json({ saved: false, message: 'Post removed from saved posts' });
    } else {
      // Post is not saved, so add it
      user.savedposts.push({ postId });
      await user.save();
      res.json({ saved: true, message: 'Post saved successfully' });
    }
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getSavedPosts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have user information in the request

    const user = await User.findById(userId).populate({
      path: 'savedposts.postId',
      populate: {
        path: 'userId',
        select: 'username image'
      }
    });

    const savedPosts = user.savedposts.map(savedPost => savedPost.postId);
    res.json(savedPosts);
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
};