import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/navBar';
import Footer from '../components/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faEnvelope, faUserPlus, faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const Friends = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCallInfo, setCurrentCallInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCurrentUser();
      await fetchFriends();
      await fetchSentRequests();
      setIsUserLoaded(true);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    return () => {
      if (isInCall) {
        endVideoCall();
      }
    };
  }, [isInCall]);

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
      alert('Friend request sent successfully');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
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
      alert('Friend removed successfully');
    } catch (error) {
      console.error('Error removing friend:', error);
      alert('Failed to remove friend');
    }
  };

  const startVideoCall = async (friend) => {
    if (!currentUser || !currentUser._id) {
      setError('Unable to start call. User information is missing. Please try logging in again.');
      return;
    }

    try {
      const roomID = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        2025053425, // Replace with your actual APP_ID
        'fc4b34d4f4a384d692dc64e963be35d0', // Replace with your actual SERVER_SECRET
        roomID,
        currentUser._id,
        currentUser.username
      );

      setCurrentCallInfo({
        roomID,
        token: kitToken,
        userID: currentUser._id,
        userName: currentUser.username,
        friendName: friend.username,
      });
      setIsInCall(true);
    } catch (error) {
      console.error('Error starting video call:', error);
      setError('Failed to start video call. Please try again.');
    }
  };

  const endVideoCall = () => {
    setIsInCall(false);
    setCurrentCallInfo(null);
  };

  const VideoCallUI = () => {
    const myMeeting = async (element) => {
      const zp = ZegoUIKitPrebuilt.create(currentCallInfo.token);
      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: false,
      });
    };

    return (
      <div className="video-call-container" style={{ width: '100vw', height: '100vh' }}>
        <div ref={myMeeting} style={{ width: '100%', height: '100%' }} />
        <button
          onClick={endVideoCall}
          className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded"
        >
          End Call
        </button>
      </div>
    );
  };

  if (!isUserLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <>
      <Navbar />
      {isInCall && currentCallInfo ? (
        <VideoCallUI />
      ) : (
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
      )}
      <Footer />
    </>
  );
};

export default Friends;