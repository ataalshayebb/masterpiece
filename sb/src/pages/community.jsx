


import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Avatar, Button, TextField, IconButton, MenuItem } from '@mui/material';
import { ThumbUp, Comment, Share } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from '../components/navBar';
import Footer from '../components/footer';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ec4899', // Tailwind's pink-500
    },
  },
});

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
    }
  });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      let url = '/posts';
      
      switch (filter) {
        case 'mostLiked':
          url += '?sort=likes';
          break;
        case 'mostCommented':
          url += '?sort=comments';
          break;
        case 'recent':
        default:
          // The default sorting is already by recent
          break;
      }

      const response = await api.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again later.');
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized: Please log in again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.userId.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCreatePost = async (newPost) => {
    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts([response.data, ...posts]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating post:', error);
     
      
      Swal.fire({
        title: 'Error!',
        text: 'Failed to create post. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized: Please log in again');
      }
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);
      setPosts(posts.map(post => post._id === postId ? response.data : post));
    } catch (error) {
      console.error('Error liking post:', error);
   
      Swal.fire({
        title: 'Error!',
        text: 'Failed to like post. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized: Please log in again');
      }
    }
  };

  const handleComment = async (postId, comment) => {
    try {
      const response = await api.post(`/posts/${postId}/comment`, { comment });
      setPosts(posts.map(post => post._id === postId ? response.data : post));
    } catch (error) {
      console.error('Error commenting on post:', error);
   
      Swal.fire({
        title: 'Error!',
        text: 'Failed to add comment. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      if (error.response && error.response.status === 401) {
        console.log('Unauthorized: Please log in again');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <header className="bg-white shadow-md p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Community</h1>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
              <div className="flex items-center space-x-4">
                <TextField
                  select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  variant="outlined"
                  className="bg-white"
                >
                  <MenuItem value="recent">Recently Uploaded</MenuItem>
                  <MenuItem value="mostLiked">Most Liked</MenuItem>
                  <MenuItem value="mostCommented">Most Commented</MenuItem>
                </TextField>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Create Post
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow overflow-y-auto">
          {isLoading && <p className="text-center mt-8">Loading posts...</p>}
          {error && <p className="text-center mt-8 text-red-500">{error}</p>}

          {!isLoading && !error && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {filteredPosts.map((post) => (
                  <PostItem
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onComment={handleComment}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
        <Footer />
        {isModalOpen && (
          <CreatePostModal onClose={() => setIsModalOpen(false)} onCreatePost={handleCreatePost} />
        )}
      </div>
    </ThemeProvider>
  );
};
const PostItem = ({ post, onLike, onComment }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.userId.username}`,
        text: post.content,
        url: window.location.href,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
     
      Swal.fire({
        title: 'Error!',
        text: 'Web Share API is not supported in your browser. You can copy the URL to share this post.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    onComment(post._id, commentText);
    setCommentText('');
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Avatar src={post.userId.image || '/default-avatar.png'} alt={post.userId.username} className="mr-4" />
          <div>
            <h2 className="font-semibold text-lg">{post.userId.username}</h2>
            <p className="text-gray-500 text-sm">{format(new Date(post.createdAt), 'MMMM d, yyyy')}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.content}</p>
        {post.imageUrl && (
          <div className="mb-4 rounded-lg overflow-hidden" style={{ maxWidth: '50%', margin: '0 auto' }}>
            <img src={`http://localhost:5000${post.imageUrl}`} alt="Post content" className="w-full" />
          </div>
        )}
        <div className="mt-4 flex justify-between items-center border-t border-b border-gray-200 py-2">
          <IconButton onClick={() => onLike(post._id)} color="primary">
            <ThumbUp /> <span className="ml-1 text-pink-500">{post.likes.length}</span>
          </IconButton>
          <IconButton onClick={() => setShowComments(!showComments)} color="primary">
            <Comment /> <span className="ml-1 text-pink-500">{post.comments.length}</span>
          </IconButton>
          <IconButton onClick={handleShare} color="primary">
            <Share />
          </IconButton>
        </div>
        {showComments && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Comments:</h3>
            <ul className="space-y-2">
              {post.comments.map((comment, index) => (
                <li key={index} className="bg-gray-50 p-2 rounded">
                  <strong>{comment.userId.username}:</strong> {comment.comment}
                </li>
              ))}
            </ul>
            <form onSubmit={handleSubmitComment} className="mt-4">
              <TextField
                fullWidth
                variant="outlined"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="mb-2"
              />
              <Button type="submit" variant="contained" color="primary">
                Post Comment
              </Button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CreatePostModal = ({ onClose, onCreatePost }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreatePost({ content, image: file });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="mb-4"
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
            accept="image/*"
          />
          <div className="flex justify-end space-x-4">
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
// ... (PostItem and CreatePostModal components remain the same)

export default CommunityPage;