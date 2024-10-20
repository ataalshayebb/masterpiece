import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  CircularProgress,
  Chip,
  Divider,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import VideoCallIcon from '@mui/icons-material/VideoCall';

const Container = styled(Box)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  maxWidth: 400,
  backgroundColor: 'white', // Set background color to white
  margin: '0 auto',
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  minWidth: 0,
  [theme.breakpoints.up('sm')]: {
    minWidth: 0,
  },
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(1),
  color: 'rgba(0, 0, 0, 0.85)',
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
  ].join(','),
  '&:hover': {
    color: '#40a9ff',
    opacity: 1,
  },
  '&.Mui-selected': {
    color: '#1890ff',
    fontWeight: theme.typography.fontWeightMedium,
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#d1eaff',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  color: '#4caf50',
  borderColor: '#4caf50',
  '&:hover': {
    backgroundColor: 'rgba(76, 175, 80, 0.04)',
  },
}));

const Friends = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
    }
  });

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (activeTab === 2) {
        searchUsers(term);
      }
    }, 300),
    [activeTab]
  );

  useEffect(() => {
    fetchFriends();
    fetchSuggestions();
    setIsUserLoaded(true);
  }, []);

  useEffect(() => {
    if (activeTab === 2) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch, activeTab]);

  const fetchFriends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/friends/friends');
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Failed to fetch friends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/friends/suggestions');
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setError('Failed to fetch suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await api.post('/friends/remove-friend', { friendId });
      setFriends(friends.filter(friend => friend._id !== friendId));
    } catch (error) {
      console.error('Error removing friend:', error);
      setError('Failed to remove friend. Please try again.');
    }
  };

  const sendFriendRequest = async (userId) => {
    try {
      await api.post('/friends/send-request', { friendId: userId });
      setSuggestions(suggestions.filter(suggestion => suggestion._id !== userId));
      setSearchResults(searchResults.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request. Please try again.');
    }
  };

  const searchUsers = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/auth/search?term=${term}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchTerm('');
    setSearchResults([]);
  };

  const startVideoCall = (friend) => {
    if (!currentUser || !currentUser._id) {
      setError('Unable to start call. User information is missing. Please try logging in again.');
      return;
    }
    
    const roomID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/debate-screen?roomId=${roomID}&friendName=${friend.username}`);
  };

  const renderList = () => {
    let listToRender;
    switch (activeTab) {
      case 0:
        listToRender = friends;
        break;
      case 1:
        listToRender = suggestions;
        break;
      case 2:
        listToRender = searchResults;
        break;
      default:
        listToRender = [];
    }
    
    return (
      <List>
        {listToRender.map((user, index) => (
          <React.Fragment key={user._id}>
            <ListItem
              secondaryAction={
                <>
                  {activeTab === 0 && (
                    <Tooltip title="Start video call">
                      <IconButton
                        edge="end"
                        aria-label="video call"
                        onClick={() => startVideoCall(user)}
                        sx={{ mr: 1 }}
                      >
                        <VideoCallIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {activeTab === 0 ? (
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={() => removeFriend(user._id)}
                    >
                      Remove
                    </ActionButton>
                  ) : (
                    <ActionButton
                      variant="outlined"
                      size="small"
                      onClick={() => sendFriendRequest(user._id)}
                    >
                      Add
                    </ActionButton>
                  )}
                </>
              }
            >
              <ListItemAvatar>
                <Avatar src={user.image || 'https://via.placeholder.com/40'} alt={user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={user.username}
                secondary={
                  <React.Fragment>
                    {user.city && <Chip size="small" label={user.city} sx={{ mr: 1 }} />}
                    {user.level && <Chip size="small" label={user.level} />}
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < listToRender.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    );
  };

  if (!isUserLoaded) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        aria-label="friend list tabs"
        variant="fullWidth"
      >
        <StyledTab label="Your List" />
        <StyledTab label="Suggestions" />
        <StyledTab label="Search" />
      </Tabs>
      {activeTab === 2 && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search for users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      )}
      {isLoading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}
      {renderList()}
    </Container>
  );
};

export default Friends;