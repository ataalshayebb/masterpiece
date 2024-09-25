import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import { LongerMessagesPopup, NitroPlanPopup, PaymentTypePopup } from '../components/paymentt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPaperPlane, faPhone, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/footer';
import io from 'socket.io-client';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.emit('join', userId);

    socketRef.current.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    fetchFriends();

    return () => socketRef.current.disconnect();
  }, [userId]);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/friends/friends', {
        headers: { 'x-auth-token': token }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Failed to load friends. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (friendId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages?userId=${userId}&friendId=${friendId}`, {
        headers: { 'x-auth-token': token }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
    }
  };

  const handleFriendClick = (friendId) => {
    setSelectedFriendId(friendId);
    fetchMessages(friendId);
  };

  const handleSendMessage = () => {
    if (message.trim() && selectedFriendId) {
      const newMessage = {
        senderId: userId,
        receiverId: selectedFriendId,
        content: message
      };
      socketRef.current.emit('sendMessage', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  const handleVideoCallClick = () => {
    if (showPopup === null) {
      setShowPopup(1);
    } else if (showPopup === 1) {
      setShowPopup(2);
    } else if (showPopup === 2) {
      setShowPopup(3);
    }
  };

  const handleSubscribe = () => setShowPopup(2);
  const handleSelect = () => setShowPopup(3);
  const handleClosePopup = () => setShowPopup(null);

  const selectedFriend = friends.find(f => f._id === selectedFriendId);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-100">
        {/* Friends List */}
        <div className="w-1/4 bg-white shadow-lg overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold p-4 border-b">Messages</h2>
          {friends.map((friend) => (
            <div
              key={friend._id}
              onClick={() => handleFriendClick(friend._id)}
              className={`p-4 cursor-pointer hover:bg-gray-100 flex items-center ${selectedFriendId === friend._id ? 'bg-blue-50' : ''}`}
            >
              <img src={friend.image || 'https://via.placeholder.com/40'} alt={friend.username} className="w-10 h-10 rounded-full mr-3" />
              <div className="flex-1">
                <p className="font-semibold">{friend.username}</p>
                <p className="text-sm text-gray-500">Click to view conversation</p>
              </div>
              <button onClick={handleVideoCallClick} className="p-2 rounded-full hover:bg-gray-100">
                <FontAwesomeIcon icon={faVideo} className="text-pink-500" />
              </button>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white shadow-lg">
          {/* Chat Header */}
          {selectedFriend && (
            <div className="bg-white p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <img src={selectedFriend.image || 'https://via.placeholder.com/40'} alt={selectedFriend.username} className="w-10 h-10 rounded-full mr-3" />
                <h1 className="text-xl font-bold">{selectedFriend.username}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <FontAwesomeIcon icon={faPhone} className="text-purple-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100" onClick={handleVideoCallClick}>
                  <FontAwesomeIcon icon={faVideo} className="text-pink-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </button>
              </div>
            </div>
          )}

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {messages.map((message, index) => (
              <div key={index} className={`mb-4 flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${message.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Message Box */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-transparent outline-none"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>

        {/* Popups */}
        {showPopup === 1 && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-50 absolute inset-0" onClick={handleClosePopup}></div>
            <div className="relative bg-gray-800 text-white p-4 rounded-lg max-w-md">
              <LongerMessagesPopup onSubscribe={handleSubscribe} onClose={handleClosePopup} />
            </div>
          </div>
        )}
        {showPopup === 2 && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-50 absolute inset-0" onClick={handleClosePopup}></div>
            <div className="relative bg-gray-800 text-white p-4 rounded-lg max-w-md">
              <NitroPlanPopup onSelect={handleSelect} onClose={handleClosePopup} />
            </div>
          </div>
        )}
        {showPopup === 3 && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black bg-opacity-50 absolute inset-0" onClick={handleClosePopup}></div>
            <div className="relative bg-gray-800 text-white p-4 rounded-lg max-w-md">
              <PaymentTypePopup onClose={handleClosePopup} />
            </div>
          </div>
        )}
      </div>
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
    </>
  );
};

export default ChatInterface;