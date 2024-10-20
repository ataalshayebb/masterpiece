import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Avatar, Button, TextField, Card, CardContent, 
  Typography, Box, Paper, InputAdornment, Divider,
  IconButton
} from '@mui/material';
import { 
  ThumbUp, Comment, Share, Search, FilterList, 
  Image, Send, BookmarkBorder, Bookmark 
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
  transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  '&:hover': {
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
  },
  marginBottom: theme.spacing(3),
}));

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [postFile, setPostFile] = useState(null);
  const [postFilter, setPostFilter] = useState('recent');
  const [postSearchTerm, setPostSearchTerm] = useState('');
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [savedPosts, setSavedPosts] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
    }
  });

  useEffect(() => {
    fetchPosts();
    fetchUserData();
    fetchSavedPosts();
  }, [postFilter]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/current-user');
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      setIsPostsLoading(true);
      setPostsError(null);
      let url = '/posts';
      
      switch (postFilter) {
        case 'mostLiked':
          url += '?sort=likes';
          break;
        case 'mostCommented':
          url += '?sort=comments';
          break;
        case 'recent':
        default:
          break;
      }

      const response = await api.get(url);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPostsError('Failed to fetch posts. Please try again later.');
    } finally {
      setIsPostsLoading(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const response = await api.get('/posts/saved');
      setSavedPosts(response.data.map(post => post._id));
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('content', postContent);
      if (postFile) {
        formData.append('image', postFile);
      }

      const response = await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts([response.data, ...posts]);
      setPostContent('');
      setPostFile(null);
      Swal.fire({
        title: 'Success!',
        text: 'Post Created Successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error creating post:', error);

      Swal.fire({
        title: 'Error!',
        text: 'Failed to create post. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
        text: 'Failed to comment on post. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/save`);
      if (response.data.saved) {
        setSavedPosts([...savedPosts, postId]);
      } else {
        setSavedPosts(savedPosts.filter(id => id !== postId));
      }
      Swal.fire({
        title: 'Success!',
        text: 'Post saved successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error saving post:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to save post. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(postSearchTerm.toLowerCase()) ||
                          post.userId.username.toLowerCase().includes(postSearchTerm.toLowerCase());
    return matchesSearch;
  });

  const PostItem = ({ post, onLike, onComment, onSave }) => {
    const [commentText, setCommentText] = useState('');
    const [showComments, setShowComments] = useState(false);
    const isSaved = savedPosts.includes(post._id);

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
      <StyledCard>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar src={post.userId.image || '/default-avatar.png'} alt={post.userId.username} sx={{ mr: 2 }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">{post.userId.username}</Typography>
              <Typography variant="caption" color="text.secondary">
                {format(new Date(post.createdAt), 'MMM d, yyyy')} • <span role="img" aria-label="globe">🌎</span>
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" paragraph>{post.content}</Typography>
          {post.imageUrl && (
            <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
              <img src={`http://localhost:5000${post.imageUrl}`} alt="Post content" style={{ width: '100%', height: 'auto' }} />
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button startIcon={<ThumbUp />} onClick={() => onLike(post._id)} sx={{ color: 'text.secondary' }}>
              Like ({post.likes.length})
            </Button>
            <Button startIcon={<Comment />} onClick={() => setShowComments(!showComments)} sx={{ color: 'text.secondary' }}>
              Comment ({post.comments.length})
            </Button>
            <Button startIcon={<Share />} onClick={handleShare} sx={{ color: 'text.secondary' }}>
              Share
            </Button>
            <IconButton onClick={() => onSave(post._id)} color={isSaved ? "primary" : "default"}>
              {isSaved ? <Bookmark /> : <BookmarkBorder />}
            </IconButton>
          </Box>
          {showComments && (
            <Box sx={{ mt: 2 }}>
              {post.comments.map((comment, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
                  <Avatar src={comment.userId.image || '/default-avatar.png'} alt={comment.userId.username} sx={{ mr: 2, width: 32, height: 32 }} />
                  <Box sx={{ bgcolor: 'grey.100', borderRadius: 2, p: 1, flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">{comment.userId.username}</Typography>
                    <Typography variant="body2">{comment.comment}</Typography>
                  </Box>
                </Box>
              ))}
              <Box component="form" onSubmit={handleSubmitComment} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Avatar src={userData?.image || '/default-avatar.png'} alt={userData?.username} sx={{ mr: 2, width: 32, height: 32 }} />
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit" edge="end">
                          <Send />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </StyledCard>
    );
  };

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h4" gutterBottom>Your Feed</Typography>
      <StyledCard>
        <CardContent>
          <Box component="form" onSubmit={handleCreatePost}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar src={userData?.image || '/default-avatar.png'} alt={userData?.username} sx={{ mr: 2 }} />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Start a post"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                multiline
                rows={3}
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={(e) => setPostFile(e.target.files[0])}
              />
              <label htmlFor="raised-button-file">
                <Button component="span" startIcon={<Image />}>
                  Photo
                </Button>
              </label>
              <Button type="submit" variant="contained" color="primary">
                Post
              </Button>
            </Box>
          </Box>
        </CardContent>
      </StyledCard>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search posts..."
          value={postSearchTerm}
          onChange={(e) => setPostSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, mr: 2 }}
        />
        <TextField
          select
          value={postFilter}
          onChange={(e) => setPostFilter(e.target.value)}
          variant="outlined"
          sx={{ width: 150 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            ),
          }}
        >
          <option value="recent">Recent</option>
          <option value="mostLiked">Most Liked</option>
          <option value="mostCommented">Most Commented</option>
        </TextField>
      </Box>
      {isPostsLoading && <Typography>Loading posts...</Typography>}
      {postsError && <Typography color="error">{postsError}</Typography>}
      <motion.div layout>
        {filteredPosts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onSave={handleSavePost}
          />
        ))}
      </motion.div>
    </Paper>
  );
};

export default Posts;