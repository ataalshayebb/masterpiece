import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faUserPlus, faUserMinus, faCheck } from '@fortawesome/free-solid-svg-icons';

const FriendsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const [friendsResponse, pendingResponse, sentResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/friends/friends', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/api/friends/friend-requests', { headers: { 'x-auth-token': token } }),
        axios.get('http://localhost:5000/api/friends/sent-requests', { headers: { 'x-auth-token': token } })
      ]);

      console.log('Friends data:', friendsResponse.data);
      console.log('Pending requests:', pendingResponse.data);
      console.log('Sent requests:', sentResponse.data);

      setFriends(friendsResponse.data);
      setPendingRequests(pendingResponse.data);
      setSentRequests(sentResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'An error occurred while fetching data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sendFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/send-request', 
        { friendId },
        { headers: { 'x-auth-token': token } }
      );
      fetchData();
    } catch (error) {
      console.error('Error sending friend request:', error);
      setError('Failed to send friend request');
    }
  };

  const acceptFriendRequest = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/accept-request', 
        { friendId },
        { headers: { 'x-auth-token': token } }
      );
      fetchData();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      setError('Failed to accept friend request');
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/remove-friend', 
        { friendId },
        { headers: { 'x-auth-token': token } }
      );
      fetchData();
    } catch (error) {
      console.error('Error removing friend:', error);
      setError('Failed to remove friend');
    }
  };

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading friends data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="w-64 bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-pink-500 mb-4 text-xl">Friends ({friends.length})</h3>
      <input 
        type="text" 
        placeholder="Search friends..." 
        className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {pendingRequests.map((request) => (
          <li key={request._id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md transition duration-200">
            <div className="flex items-center space-x-3">
              <img src={request.image || 'https://via.placeholder.com/40'} alt={request.username} className="w-10 h-10 rounded-full object-cover" />
              <span className="font-medium text-gray-700">{request.username}</span>
            </div>
            <button onClick={() => acceptFriendRequest(request._id)} className="text-green-500 hover:text-green-600 transition duration-200">
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </li>
        ))}
        {filteredFriends.map((friend) => (
          <li key={friend._id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md transition duration-200">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img src={friend.image || 'https://via.placeholder.com/40'} alt={friend.username} className="w-10 h-10 rounded-full object-cover" />
                <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(friend.status)} rounded-full border-2 border-white`}></div>
              </div>
              <span className="font-medium text-gray-700">{friend.username}</span>
            </div>
            <div className="flex space-x-2">
              <Link to={`/messages/${friend._id}`} className="text-pink-500 hover:text-pink-600 transition duration-200">
                <FontAwesomeIcon icon={faCommentDots} />
              </Link>
              <button onClick={() => removeFriend(friend._id)} className="text-red-500 hover:text-red-600 transition duration-200">
                <FontAwesomeIcon icon={faUserMinus} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
    </div>
  );
};

export default FriendsList;