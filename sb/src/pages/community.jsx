// import React, { useState, useEffect, useCallback } from 'react';
// import { format } from 'date-fns';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import { 
//   Avatar, Button, TextField, IconButton, MenuItem, Card, CardContent, 
//   Typography, Divider, Chip, Box, Paper, InputAdornment
// } from '@mui/material';
// import { ThumbUp, Comment, Share, Search, FilterList } from '@mui/icons-material';
// import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// import { Link, useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faVideo, faEnvelope, faUserPlus, faUserMinus, faCheck, faCommentDots } from '@fortawesome/free-solid-svg-icons';
// import { debounce } from 'lodash';
// import { CheckCircle } from '@mui/icons-material';
// import Navbar from '../components/navBar';
// import Footer from '../components/footer';

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#ec4899',
//     },
//     secondary: {
//       main: '#dc004e',
//     },
//     background: {
//       default: '#ffffff',
//     },
//   },
//   typography: {
//     fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: 'none',
//         },
//       },
//     },
//   },
// });

// const StyledCard = styled(Card)(({ theme }) => ({
//   boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
//   transition: 'box-shadow 0.3s ease-in-out',
//   '&:hover': {
//     boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
//   },
// }));

// const CommunityPage = () => {
//   const [posts, setPosts] = useState([]);
//   const [isPostModalOpen, setIsPostModalOpen] = useState(false);
//   const [postFilter, setPostFilter] = useState('recent');
//   const [postSearchTerm, setPostSearchTerm] = useState('');
//   const [isPostsLoading, setIsPostsLoading] = useState(true);
//   const [postsError, setPostsError] = useState(null);

//   const [friends, setFriends] = useState([]);
//   const [friendSearchTerm, setFriendSearchTerm] = useState('');
//   const [friendSearchResults, setFriendSearchResults] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [sentRequests, setSentRequests] = useState([]);
//   const [isFriendsLoading, setIsFriendsLoading] = useState(false);
//   const [friendsError, setFriendsError] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isUserLoaded, setIsUserLoaded] = useState(false);

//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(friendSearchTerm);

//   const navigate = useNavigate();

//   const api = axios.create({
//     baseURL: 'http://localhost:5000/api',
//     headers: {
//       'Content-Type': 'application/json',
//       'x-auth-token': localStorage.getItem('token')
//     }
//   });

//   const debouncedSetSearchTerm = useCallback(
//     debounce((term) => setDebouncedSearchTerm(term), 300),
//     []
//   );

//   useEffect(() => {
//     const loadInitialData = async () => {
//       await fetchCurrentUser();
//       await fetchPosts();
//       await fetchFriends();
//       setIsUserLoaded(true);
//     };
//     loadInitialData();
//   }, [postFilter]);

//   useEffect(() => {
//     debouncedSetSearchTerm(friendSearchTerm);
//   }, [friendSearchTerm, debouncedSetSearchTerm]);

//   useEffect(() => {
//     const searchFriends = async () => {
//       if (!debouncedSearchTerm.trim()) {
//         setFriendSearchResults([]);
//         return;
//       }
//       setIsFriendsLoading(true);
//       setFriendsError(null);
//       try {
//         const response = await api.get(`/auth/search?term=${debouncedSearchTerm}`);
//         setFriendSearchResults(response.data);
//       } catch (error) {
//         console.error('Error searching users:', error);
//         setFriendsError('Failed to search users. Please try again.');
//       } finally {
//         setIsFriendsLoading(false);
//       }
//     };

//     searchFriends();
//   }, [debouncedSearchTerm]);

//   const fetchCurrentUser = async () => {
//     try {
//       const response = await api.get('/auth/current-user');
//       if (response.data && response.data._id) {
//         setCurrentUser(response.data);
//         localStorage.setItem('userId', response.data._id);
//         localStorage.setItem('username', response.data.username);
//       } else {
//         throw new Error('Invalid user data received');
//       }
//     } catch (error) {
//       console.error('Error fetching current user:', error);
//       setFriendsError('Failed to fetch user information. Please try logging in again.');
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       setIsPostsLoading(true);
//       setPostsError(null);
//       let url = '/posts';
      
//       switch (postFilter) {
//         case 'mostLiked':
//           url += '?sort=likes';
//           break;
//         case 'mostCommented':
//           url += '?sort=comments';
//           break;
//         case 'recent':
//         default:
//           break;
//       }

//       const response = await api.get(url);
//       setPosts(response.data);
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//       setPostsError('Failed to fetch posts. Please try again later.');
//     } finally {
//       setIsPostsLoading(false);
//     }
//   };

//   const fetchFriends = async () => {
//     setIsFriendsLoading(true);
//     setFriendsError(null);
//     try {
//       const [friendsResponse, pendingResponse, sentResponse] = await Promise.all([
//         api.get('/friends/friends'),
//         api.get('/friends/friend-requests'),
//         api.get('/friends/sent-requests')
//       ]);

//       setFriends(friendsResponse.data);
//       setPendingRequests(pendingResponse.data);
//       setSentRequests(sentResponse.data);
//     } catch (error) {
//       console.error('Error fetching friends data:', error);
//       setFriendsError('Failed to fetch friends data. Please try again.');
//     } finally {
//       setIsFriendsLoading(false);
//     }
//   };

//   const handleCreatePost = async (newPost) => {
//     try {
//       const formData = new FormData();
//       formData.append('content', newPost.content);
//       if (newPost.image) {
//         formData.append('image', newPost.image);
//       }

//       const response = await api.post('/posts', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });

//       setPosts([response.data, ...posts]);
//       setIsPostModalOpen(false);
//       await Swal.fire({
//         title: 'Success!',
//         text: 'Post created successfully',
//         icon: 'success',
//         confirmButtonText: 'OK'
//       });
//     } catch (error) {
//       console.error('Error creating post:', error);
//       await Swal.fire({
//         title: 'Error!',
//         text: 'Failed to create post. Please try again.',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     }
//   };

//   const handleLike = async (postId) => {
//     try {
//       const response = await api.post(`/posts/${postId}/like`);
//       setPosts(posts.map(post => post._id === postId ? response.data : post));
//     } catch (error) {
//       console.error('Error liking post:', error);
//       await Swal.fire({
//         title: 'Error!',
//         text: 'Failed to like post. Please try again.',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     }
//   };

//   const handleComment = async (postId, comment) => {
//     try {
//       const response = await api.post(`/posts/${postId}/comment`, { comment });
//       setPosts(posts.map(post => post._id === postId ? response.data : post));
//     } catch (error) {
//       console.error('Error commenting on post:', error);
//       await Swal.fire({
//         title: 'Error!',
//         text: 'Failed to add comment. Please try again.',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     }
//   };

//   const sendFriendRequest = async (friendId) => {
//     try {
//       await api.post('/friends/send-request', { friendId });
//       setSentRequests([...sentRequests, { _id: friendId }]);
//       await Swal.fire({
//         title: 'Success!',
//         text: 'Friend request sent successfully',
//         icon: 'success',
//         confirmButtonText: 'OK'
//       });
//     } catch (error) {
//       console.error('Error sending friend request:', error);
//       await Swal.fire({
//         title: 'Error!',
//         text: 'Failed to send friend request',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     }
//   };

//   const acceptFriendRequest = async (friendId) => {
//     try {
//       await api.post('/friends/accept-request', { friendId });
//       await fetchFriends();
//       await Swal.fire({
//         title: 'Success!',
//         text: 'Friend request accepted',
//         icon: 'success',
//         confirmButtonText: 'OK'
//       });
//     } catch (error) {
//       console.error('Error accepting friend request:', error);
//       await Swal.fire({
//         title: 'Error!',
//         text: 'Failed to accept friend request',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     }
//   };

//   const removeFriend = async (friendId) => {
//     try {
//       await api.post('/friends/remove-friend', { friendId });
//       setFriends(friends.filter(friend => friend._id !== friendId));
//       await Swal.fire({
//         title: 'Success!',
//         text: 'Friend removed successfully',
//         icon: 'success',
//         confirmButtonText: 'OK'
//       });
//     } catch (error) {
//       console.error('Error removing friend:', error);
//       await Swal.fire({
//         title: 'Error!',
//         text: 'Failed to remove friend',
//         icon: 'error',
//         confirmButtonText: 'OK'
//       });
//     }
//   };

//   const startVideoCall = (friend) => {
//     if (!currentUser || !currentUser._id) {
//       setFriendsError('Unable to start call. User information is missing. Please try logging in again.');
//       return;
//     }

//     const roomID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//     navigate(`/debate-screen?roomId=${roomID}&friendName=${friend.username}`);
//   };

//   const filteredPosts = posts.filter(post => {
//     const matchesSearch = post.content.toLowerCase().includes(postSearchTerm.toLowerCase()) ||
//                           post.userId.username.toLowerCase().includes(postSearchTerm.toLowerCase());
//     return matchesSearch;
//   });

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'online': return '#4caf50';
//       case 'offline': return '#9e9e9e';
//       case 'away': return '#ff9800';
//       default: return '#9e9e9e';
//     }
//   };

//   if (!isUserLoaded) {
//     return <div>Loading user data...</div>;
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
//         <Navbar />
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
//             <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
//               {/* Left column: Community Posts */}
//               <Box sx={{ flex: 2 }}>
//                 <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
//                   <Typography variant="h4" gutterBottom>Community</Typography>
//                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
//                     <TextField
//                       variant="outlined"
//                       placeholder="Search posts..."
//                       value={postSearchTerm}
//                       onChange={(e) => setPostSearchTerm(e.target.value)}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <Search />
//                           </InputAdornment>
//                         ),
//                       }}
//                       sx={{ flex: 1, mr: 2 }}
//                     />
//                     <TextField
//                       select
//                       value={postFilter}
//                       onChange={(e) => setPostFilter(e.target.value)}
//                       variant="outlined"
//                       sx={{ width: 150 }}
//                       InputProps={{
//                         startAdornment: (
//                           <InputAdornment position="start">
//                             <FilterList />
//                           </InputAdornment>
//                         ),
//                       }}
//                     >
//                       <MenuItem value="recent">Recent</MenuItem>
//                       <MenuItem value="mostLiked">Most Liked</MenuItem>
//                       <MenuItem value="mostCommented">Most Commented</MenuItem>
//                     </TextField>
//                   </Box>
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => setIsPostModalOpen(true)}
//                     sx={{ mb: 3 }}
//                   >
//                     Create Post
//                   </Button>
//                   {isPostsLoading && <Typography>Loading posts...</Typography>}
//                   {postsError && <Typography color="error">{postsError}</Typography>}
//                   <AnimatePresence>
//                     {filteredPosts.map((post) => (
//                       <PostItem
//                         key={post._id}
//                         post={post}
//                         onLike={handleLike}
//                         onComment={handleComment}
//                       />
//                     ))}
//                   </AnimatePresence>
//                 </Paper>
//               </Box>

//               {/* Right column: Friends */}
//               <Box sx={{ flex: 1 }}>
//               <Paper elevation={0} sx={{ p: 3, position: 'sticky', top: 20 }}>
//                   <Typography variant="h5" gutterBottom>Friends ({friends.length})</Typography>
//                   <TextField
//                     fullWidth
//                     variant="outlined"
//                     placeholder="Search friends..."
//                     value={friendSearchTerm}
//                     onChange={(e) => setFriendSearchTerm(e.target.value)}
//                     InputProps={{
//                       startAdornment: (
//                         <InputAdornment position="start">
//                           <Search />
//                         </InputAdornment>
//                       ),
//                     }}
//                     sx={{ mb: 2 }}
//                   />
//                   {isFriendsLoading && <Typography>Searching...</Typography>}
//                   {friendsError && <Typography color="error">{friendsError}</Typography>}
//                   <Box sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto', pr: 1 }}>
//                     {pendingRequests.length > 0 && (
//                       <Box sx={{ mb: 2 }}>
//                         <Typography variant="subtitle1" gutterBottom>Pending Requests</Typography>
//                         {pendingRequests.map((request) => (
//                           <Box key={request._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Avatar src={request.image || 'https://via.placeholder.com/40'} alt={request.username} sx={{ mr: 1 }} />
//                               <Typography variant="body2">{request.username}</Typography>
//                             </Box>
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               color="primary"
//                               onClick={() => acceptFriendRequest(request._id)}
//                               startIcon={<FontAwesomeIcon icon={faCheck} />}
//                             >
//                               Accept
//                             </Button>
//                           </Box>
//                         ))}
//                         <Divider sx={{ my: 2 }} />
//                       </Box>
//                     )}
//                     {friends.map((friend) => (
//                       <Box key={friend._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <Avatar src={friend.image || 'https://via.placeholder.com/40'} alt={friend.username} sx={{ mr: 1 }} />
//                           <Box>
//                             <Typography variant="body2">{friend.username}</Typography>
                         
//                           </Box>
//                         </Box>
//                         <Box>
//                           <IconButton onClick={() => startVideoCall(friend)} size="small" color="primary">
//                             <FontAwesomeIcon icon={faVideo} />
//                           </IconButton>
//                           <IconButton component={Link} to={`/messages/${friend._id}`} size="small" color="primary">
//                             <FontAwesomeIcon icon={faCommentDots} />
//                           </IconButton>
//                           <IconButton onClick={() => removeFriend(friend._id)} size="small" color="secondary">
//                             <FontAwesomeIcon icon={faUserMinus} />
//                           </IconButton>
//                         </Box>
//                       </Box>
//                     ))}
//                   </Box>
//                   {friendSearchResults.length > 0 && (
//                     <Box sx={{ mt: 2 }}>
//                       <Typography variant="subtitle1" gutterBottom>Search Results</Typography>
//                       {friendSearchResults.map((user) => (
//                         <Box key={user._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                             <Avatar src={user.image || 'https://via.placeholder.com/40'} alt={user.username} sx={{ mr: 1 }} />
//                             <Typography variant="body2">{user.username}</Typography>
//                           </Box>
//                           {friends.some(friend => friend._id === user._id) ? (
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               color="secondary"
//                               onClick={() => removeFriend(user._id)}
//                               startIcon={<FontAwesomeIcon icon={faUserMinus} />}
//                             >
//                               Remove
//                             </Button>
//                           ) : sentRequests.some(request => request._id === user._id) ? (
//                             <Chip 
//                             label="Requested" 
//                             size="small"
//                             icon={<CheckCircle style={{ color: '#4caf50' }} />}  // Green tick icon
//                             sx={{
//                               borderRadius: '4px',  // Makes the chip rectangular
//                               backgroundColor: '#e0e0e0',  // Light grey background
//                               '& .MuiChip-label': {  // Styles for the label
//                                 paddingRight: '4px',  // Reduces right padding to bring text and icon closer
//                               },
//                               '& .MuiChip-icon': {  // Styles for the icon
//                                 order: 1,  // Moves the icon to the right of the text
//                                 marginLeft: '4px',
//                                 marginRight: '6px',  // Adjusts the icon position
//                               },
//                             }}
//                           />
//                           ) : (
//                             <Button
//                               size="small"
//                               variant="outlined"
//                               color="primary"
//                               onClick={() => sendFriendRequest(user._id)}
//                               startIcon={<FontAwesomeIcon icon={faUserPlus} />}
//                             >
//                               Add
//                             </Button>
//                           )}
//                         </Box>
//                       ))}
//                     </Box>
//                   )}
//                 </Paper>
//               </Box>
//             </Box>
//           </Box>
//         </Box>
//         <Footer />
//         {isPostModalOpen && (
//           <CreatePostModal onClose={() => setIsPostModalOpen(false)} onCreatePost={handleCreatePost} />
//         )}
//       </Box>
//     </ThemeProvider>
//   );
// };

// const PostItem = ({ post, onLike, onComment }) => {
//   const [commentText, setCommentText] = useState('');
//   const [showComments, setShowComments] = useState(false);

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: `Post by ${post.userId.username}`,
//         text: post.content,
//         url: window.location.href,
//       })
//       .then(() => console.log('Successful share'))
//       .catch((error) => console.log('Error sharing', error));
//     } else {
//       Swal.fire({
//         title: 'Share',
//         text: 'Web Share API is not supported in your browser. You can copy the URL to share this post.',
//         icon: 'info',
//         confirmButtonText: 'OK'
//       });
//     }
//   };

//   const handleSubmitComment = (e) => {
//     e.preventDefault();
//     onComment(post._id, commentText);
//     setCommentText('');
//   };

//   return (
//     <StyledCard sx={{ mb: 3 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//           <Avatar src={post.userId.image || '/default-avatar.png'} alt={post.userId.username} sx={{ mr: 2 }} />
//           <Box>
//             <Typography variant="subtitle1">{post.userId.username}</Typography>
//             <Typography variant="caption" color="text.secondary">
//               {format(new Date(post.createdAt), 'MMMM d, yyyy')}
//             </Typography>
//           </Box>
//         </Box>
//         <Typography variant="body1" paragraph>{post.content}</Typography>
//         {post.imageUrl && (
//           <Box sx={{ mb: 2, borderRadius: 1, overflow: 'hidden' }}>
//             <img src={`http://localhost:5000${post.imageUrl}`} alt="Post content" style={{ width: '100%', height: 'auto' }} />
//           </Box>
//         )}
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
//           <Button startIcon={<ThumbUp />} onClick={() => onLike(post._id)}>
//             Like ({post.likes.length})
//           </Button>
//           <Button startIcon={<Comment />} onClick={() => setShowComments(!showComments)}>
//             Comment ({post.comments.length})
//           </Button>
//           <Button startIcon={<Share />} onClick={handleShare}>
//             Share
//           </Button>
//         </Box>
//         {showComments && (
//           <Box sx={{ mt: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>Comments:</Typography>
//             {post.comments.map((comment, index) => (
//               <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
//                 <Typography variant="body2"><strong>{comment.userId.username}:</strong> {comment.comment}</Typography>
//               </Box>
//             ))}
//             <Box component="form" onSubmit={handleSubmitComment} sx={{ mt: 2 }}>
//               <TextField
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 placeholder="Add a comment..."
//                 sx={{ mb: 1 }}
//               />
//               <Button type="submit" variant="contained" color="primary">
//                 Post Comment
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </CardContent>
//     </StyledCard>
//   );
// };

// const CreatePostModal = ({ onClose, onCreatePost }) => {
//   const [content, setContent] = useState('');
//   const [file, setFile] = useState(null);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onCreatePost({ content, image: file });
//   };

//   return (
//     <Box sx={{
//       position: 'fixed',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       bgcolor: 'rgba(0, 0, 0, 0.5)',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       zIndex: 1300,
//     }}>
//       <Paper sx={{ width: '100%', maxWidth: 500, p: 3 }}>
//         <Typography variant="h6" gutterBottom>Create a New Post</Typography>
//         <Box component="form" onSubmit={handleSubmit}>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             variant="outlined"
//             placeholder="What's on your mind?"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             required
//             sx={{ mb: 2 }}
//           />
//           <input
//             accept="image/*"
//             style={{ display: 'none' }}
//             id="raised-button-file"
//             type="file"
//             onChange={(e) => setFile(e.target.files[0])}
//           />
//           <label htmlFor="raised-button-file">
//             <Button variant="outlined" component="span" sx={{ mb: 2 }}>
//               Upload Image
//             </Button>
//           </label>
//           {file && <Typography variant="body2" sx={{ mb: 2 }}>File selected: {file.name}</Typography>}
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
//             <Button variant="outlined" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="contained" color="primary">
//               Post
//             </Button>
//           </Box>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default CommunityPage;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { Box, createTheme, ThemeProvider, CssBaseline, useMediaQuery, Drawer, Fab, Zoom, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Posts from '../components/community/posts';
import Friends from '../components/community/friends';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { People as PeopleIcon, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import ProfileSidebar from '../components/community/profile';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ec4899',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f3f2ef',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const CommunityPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(7);
  const [totalPosts, setTotalPosts] = useState(0);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': localStorage.getItem('token')
    }
  });

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCurrentUser();
      setIsUserLoaded(true);
    };
    loadInitialData();

    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/auth/current-user');
      if (response.data && response.data._id) {
        setCurrentUser(response.data);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username', response.data.username);
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      // Handle error (e.g., redirect to login page)
    }
  };

  const startVideoCall = (friend) => {
    if (!currentUser || !currentUser._id) {
      // Handle error (e.g., show an alert)
      return;
    }

    const roomID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/debate-screen?roomId=${roomID}&friendName=${friend.username}`);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    scrollToTop();
  };

  if (!isUserLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ display: 'flex', flexGrow: 1, mt: 8, px: 2 }}>
          {/* Left sidebar (Profile) */}
          {!isSmallScreen && (
            <Box sx={{ width: isSmallScreen ? '100%' : '22%', flexShrink: 0, pr: 2 }}>
              <ProfileSidebar />
            </Box>
          )}

          {/* Main content area (Posts) */}
          <Box sx={{ width: isSmallScreen ? '100%' : isMediumScreen ? '78%' : '56%', flexGrow: 1, px: 2 }}>
            <Posts 
              currentPage={currentPage}
              postsPerPage={postsPerPage}
              setTotalPosts={setTotalPosts}
              alternateBackground
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
              <Pagination 
                count={Math.ceil(totalPosts / postsPerPage)} 
                page={currentPage} 
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </Box>

          {/* Right sidebar (Friends) */}
          {!isSmallScreen && !isMediumScreen && (
            <Box sx={{ width: '22%', flexShrink: 0, pl: 2 }}>
              <Friends currentUser={currentUser} onStartVideoCall={startVideoCall} />
            </Box>
          )}
        </Box>
        <Footer />

        {/* Friends drawer for small and medium screens */}
        {(isSmallScreen || isMediumScreen) && (
          <Drawer
            anchor="right"
            open={isFriendsOpen}
            onClose={() => setIsFriendsOpen(false)}
          >
            <Box sx={{ width: 250 }}>
              <Friends currentUser={currentUser} onStartVideoCall={startVideoCall} />
            </Box>
          </Drawer>
        )}

        {/* Toggle friends button for small and medium screens */}
        {(isSmallScreen || isMediumScreen) && (
          <Fab
            color="primary"
            aria-label="toggle friends"
            onClick={() => setIsFriendsOpen(!isFriendsOpen)}
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
          >
            <PeopleIcon />
          </Fab>
        )}

        {/* Scroll to top button */}
        <Zoom in={showScrollTop}>
          <Fab
            color="secondary"
            size="small"
            aria-label="scroll back to top"
            onClick={scrollToTop}
            sx={{ position: 'fixed', bottom: 16, right: (isSmallScreen || isMediumScreen) ? 80 : 16 }}
          >
            <ArrowUpwardIcon />
          </Fab>
        </Zoom>
      </Box>
    </ThemeProvider>
  );
}

export default CommunityPage;

///////////////////////////////////////////////////////////////////////////////////////////////////////////


