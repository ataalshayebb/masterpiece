import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navBar';
import { LongerMessagesPopup, NitroPlanPopup, PaymentTypePopup } from '../components/paymentt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faPaperPlane, faPhone, faInfoCircle, faSmile, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/footer';
import io from 'socket.io-client';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import EmojiPicker from 'emoji-picker-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMobileFriendList, setShowMobileFriendList] = useState(true);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', userId);
    socketRef.current.on('newMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    fetchFriends();
    return () => socketRef.current.disconnect();
  }, [userId]);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

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
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = 10;
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again.');
    }
  };

  const handleFriendClick = (friendId) => {
    setSelectedFriendId(friendId);
    fetchMessages(friendId);
    setShowMobileFriendList(false);
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

  const handleEmojiClick = (event, emojiObject) => {
    setMessage(prevMessage => prevMessage + emojiObject.emoji);
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

  const renderMessage = (message) => {
    try {
      const parsedContent = JSON.parse(message.content);
      if (parsedContent.type === 'video-link') {
        return (
          <div className="bg-blue-100 p-3 rounded-lg mb-2">
            <p>{parsedContent.text}</p>
            <a
              href={parsedContent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Join Video Call
            </a>
            <button 
              onClick={() => window.open(parsedContent.link, "_blank")}
              className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Join Now
            </button>
          </div>
        );
      } else if (parsedContent.type === 'study-session-invite') {
        return (
          <div className="bg-blue-100 p-3 rounded-lg mb-2">
            <p>{parsedContent.text}</p>
            <a href={parsedContent.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View Session
            </a>
            <button 
              onClick={() => joinStudySession(parsedContent.sessionId)}
              className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Join Now
            </button>
          </div>
        );
      }
    } catch (error) {
      // If parsing fails, it's a regular message
    }
    return message.content;
  };

  const joinStudySession = (sessionId) => {
    navigate(`/join-study-session/${sessionId}`);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen"
      >
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex justify-center items-center h-screen text-red-500"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navbar />
      <div className="flex-grow flex justify-center items-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="flex h-[calc(100vh-8rem)] max-h-[600px]">
            {/* Friends List */}
            <AnimatePresence>
              {(showMobileFriendList || window.innerWidth > 640) && (
                <motion.div
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full sm:w-1/3 border-r overflow-y-auto custom-scrollbar bg-gray-50"
                >
                  <h2 className="text-lg font-bold p-4 border-b bg-white sticky top-0 z-10">Messages</h2>
                  {friends.map((friend) => (
                    <motion.div
                      key={friend._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleFriendClick(friend._id)}
                      className={`p-4 cursor-pointer hover:bg-gray-200 flex items-center ${selectedFriendId === friend._id ? 'bg-blue-100' : ''}`}
                    >
                      <img src={friend.image || 'https://via.placeholder.com/40'} alt={friend.username} className="w-10 h-10 rounded-full mr-3" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{friend.username}</p>
                        <p className="text-sm text-gray-500 truncate">Last message...</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              {selectedFriendId && (
                <div className="bg-white p-4 border-b flex items-center justify-between shadow-sm">
                  <div className="flex items-center">
                    <button 
                      className="sm:hidden mr-2 text-gray-600"
                      onClick={() => setShowMobileFriendList(true)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <img 
                      src={friends.find(f => f._id === selectedFriendId)?.image || 'https://via.placeholder.com/40'} 
                      alt={friends.find(f => f._id === selectedFriendId)?.username} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <h1 className="text-lg font-bold">{friends.find(f => f._id === selectedFriendId)?.username}</h1>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tooltip title="Audio Call" position="bottom" animation="scale">
                      <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                        <FontAwesomeIcon icon={faPhone} className="text-purple-500" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Video Call" position="bottom" animation="scale">
                      <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200" onClick={handleVideoCallClick}>
                        <FontAwesomeIcon icon={faVideo} className="text-pink-500" />
                      </button>
                    </Tooltip>
                    <Tooltip title="Info" position="bottom" animation="scale">
                      <button className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200">
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              )}

              {/* Message List */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-gray-100">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`mb-4 flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg text-sm ${
                          message.senderId === userId 
                            ? 'bg-blue-500 text-white rounded-br-none' 
                            : 'bg-white text-gray-800 rounded-bl-none'
                        }`}
                      >
                        {renderMessage(message)}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Message Box */}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                  <Tooltip title="Emoji" position="top" animation="scale">
                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-500 hover:text-gray-700 mr-2">
                      <FontAwesomeIcon icon={faSmile} />
                    </button>
                  </Tooltip>
                  <Tooltip title="Attach File" position="top" animation="scale">
                    <button className="text-gray-500 hover:text-gray-700 mr-2">
                      <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                  </Tooltip>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-transparent outline-none"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-16 right-4">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Popups */}
    {/* Popups */}
    <AnimatePresence>
        {showPopup !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="bg-black bg-opacity-50 absolute inset-0" onClick={handleClosePopup}></div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-gray-800 text-white p-6 rounded-lg max-w-md w-full mx-4"
            >
              {showPopup === 1 && <LongerMessagesPopup onSubscribe={handleSubscribe} onClose={handleClosePopup} />}
              {showPopup === 2 && <NitroPlanPopup onSelect={handleSelect} onClose={handleClosePopup} />}
              {showPopup === 3 && <PaymentTypePopup onClose={handleClosePopup} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2563eb;
        }
      `}</style>
      <Footer />
    </div>
  );
};

export default ChatInterface;