import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Avatar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  ThumbUp as ThumbUpIcon,
  Bookmark as BookmarkIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

const SavedPosts = ({ open, onClose }) => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: { 'x-auth-token': token }
        };

        const response = await axios.get('http://localhost:5000/api/posts/saved', config);
        setSavedPosts(response.data);
      } catch (error) {
        console.error('Error fetching saved posts:', error);
        setError(error.response?.data?.message || 'Failed to load saved posts');
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchSavedPosts();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Saved Posts
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : savedPosts.length === 0 ? (
          <Typography>No saved posts found.</Typography>
        ) : (
          savedPosts.map((post) => (
            <Paper key={post._id} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{post.userId.username}</Typography>
              <Typography variant="body1">{post.content}</Typography>
              {post.imageUrl && (
                <Box sx={{ mt: 2, maxWidth: '100%', height: 'auto' }}>
                  <img src={`http://localhost:5000${post.imageUrl}`} alt="Post content" style={{ width: '100%', height: 'auto' }} />
                </Box>
              )}
            </Paper>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProfileSidebar = () => {
  const [profileInfo, setProfileInfo] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedPostsOpen, setSavedPostsOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: { 'x-auth-token': token }
        };

        const [infoResponse, statsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/cprofile/info', config),
          axios.get('http://localhost:5000/api/cprofile/stats', config)
        ]);

        setProfileInfo(infoResponse.data);
        setProfileStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError(error.response?.data?.message || 'Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSavedItemsClick = () => {
    setSavedPostsOpen(true);
  };

  if (isLoading) {
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  if (!profileInfo || !profileStats) {
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography>No profile data available</Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={profileInfo.image || "/default-avatar.png"}
            alt={profileInfo.username}
            sx={{ width: 80, height: 80, mb: 1 }}
          />
          <Typography variant="h6">{profileInfo.username}</Typography>
          <Typography variant="body2" color="text.secondary">
            {profileInfo.bio || "Full-stack trainee at Orange Coding Academy"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {profileInfo.city}
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />
        <List dense>
          <ListItem>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Profile viewers" secondary={profileStats.profileViews} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <ThumbUpIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Post impressions" secondary={profileStats.postImpressions} />
          </ListItem>
        </List>
        <Divider sx={{ my: 1 }} />
        <List dense>
          <ListItem button onClick={handleSavedItemsClick}>
            <ListItemIcon>
              <BookmarkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Saved items" />
          </ListItem>
          <ListItem button onClick={() => console.log('Groups clicked')}>
            <ListItemIcon>
              <GroupIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Groups" />
          </ListItem>
          <ListItem button onClick={() => console.log('Events clicked')}>
            <ListItemIcon>
              <EventIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
        </List>
      </Paper>
      <SavedPosts open={savedPostsOpen} onClose={() => setSavedPostsOpen(false)} />
    </>
  );
};

export default ProfileSidebar;