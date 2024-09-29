import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faEnvelope, faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCurrentUser();
      await fetchFriends();
      await fetchSentRequests();
      setIsUserLoaded(true);
    };
    loadInitialData();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/current-user', {
        headers: { 'x-auth-token': token }
      });
      if (response.data && response.data._id) {
        setCurrentUser(response.data);
        localStorage.setItem('userId', response.data._id);
        localStorage.setItem('username', response.data.username);
      } else {
        throw new Error('Invalid user data received');
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      setError('Failed to fetch user information. Please try logging in again.');
    }
  };

  const fetchFriends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends/friends', {
        headers: { 'x-auth-token': token }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Failed to fetch friends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSentRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends/sent-requests', {
        headers: { 'x-auth-token': token }
      });
      setSentRequests(response.data.map(request => request._id));
    } catch (error) {
      console.error('Error fetching sent requests:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/auth/search?term=${searchTerm}`, {
        headers: { 'x-auth-token': token }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Failed to search users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/send-request', 
        { friendId },
        { headers: { 'x-auth-token': token } }
      );
      setSentRequests([...sentRequests, friendId]);

      Swal.fire({
        title: 'Success!',
        text: 'Friend request sent successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });

    } catch (error) {
      console.error('Error sending friend request:', error);
    
      Swal.fire({
        title: 'Error!',
        text: 'Failed to send friend request',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/remove-friend', 
        { friendId },
        { headers: { 'x-auth-token': token } }
      );
      setFriends(friends.filter(friend => friend._id !== friendId));
    
      Swal.fire({
        title: 'Success!',
        text: 'Friend removed successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      
      
    } catch (error) {
      console.error('Error removing friend:', error);
      
      Swal.fire({
        title: 'Error!',
        text: 'Failed to remove friend',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const startVideoCall = (friend) => {
    if (!currentUser || !currentUser._id) {
      setError('Unable to start call. User information is missing. Please try logging in again.');
      return;
    }

    const roomID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    navigate(`/debate-screen?roomId=${roomID}&friendName=${friend.username}`);
  };

  if (!isUserLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="bg-white p-8">
        <div className="mb-8">
          <label htmlFor="search" className="block text-lg font-medium mb-2">Add New Friends</label>
          <div className="flex">
            <input
              type="text"
              id="search"
              className="w-full p-2 border rounded-l"
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={searchUsers}
              className="bg-pink-500 text-white p-2 rounded-r"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((user) => (
                <div key={user._id} className="bg-gray-100 rounded-lg p-4 text-center">
                  <img src={user.image || 'https://via.placeholder.com/150'} alt={user.username} className="w-24 h-24 mx-auto mb-4 rounded-full object-cover" />
                  <h3 className="font-bold">{user.username}</h3>
                  {friends.some(friend => friend._id === user._id) ? (
                    <button 
                      onClick={() => removeFriend(user._id)}
                      className="mt-2 bg-red-500 text-white p-2 rounded"
                    >
                      <FontAwesomeIcon icon={faUserMinus} /> Remove Friend
                    </button>
                  ) : sentRequests.includes(user._id) ? (
                    <span className="mt-2 bg-gray-500 text-white p-2 rounded inline-block">Requested</span>
                  ) : (
                    <button 
                      onClick={() => sendFriendRequest(user._id)}
                      className="mt-2 bg-pink-500 text-white p-2 rounded"
                    >
                      <FontAwesomeIcon icon={faUserPlus} /> Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <hr className="my-8" />
        <h2 className="text-lg font-medium mb-2">Friends</h2>

        {isLoading ? (
          <p>Loading friends...</p>
        ) : friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {friends.map((friend) => (
              <div
                key={friend._id}
                className="bg-gray-100 rounded-lg p-4 text-center shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105"
              >
                <img
                  src={friend.image || 'https://via.placeholder.com/150'}
                  alt={friend.username}
                  className="w-24 h-24 mx-auto mb-4 bg-gray-300 rounded-full object-cover"
                />
                <h3 className="font-bold">{friend.username}</h3>
                <div className="mt-4 flex justify-center space-x-2">
                  <span 
                    className="text-pink-500 cursor-pointer"
                    onClick={() => startVideoCall(friend)}
                  >
                    <FontAwesomeIcon icon={faVideo} />
                  </span>
                  <Link to="/messages" className="text-purple-500 cursor-pointer">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </Link>
                  <button 
                    onClick={() => removeFriend(friend._id)}
                    className="text-red-500 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faUserMinus} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You don't have any friends yet. Start by searching for users above!</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Friends;