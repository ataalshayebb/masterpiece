import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaLightbulb, FaBook } from 'react-icons/fa';
import Navbar from '../components/navBar';

function AITutor() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    fetchUserData();
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:5000/api/profile/user', {
          headers: { 'x-auth-token': token }
        });
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await axios.post('http://localhost:5000/api/ai-tutor', {
        message,
        history: chatHistory,
      });

      const newResponse = result.data.response;
      
      setChatHistory([
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: newResponse }] },
      ]);

      setMessage('');
    } catch (error) {
      console.error('Error:', error);
      setChatHistory([
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] },
        { role: 'model', parts: [{ text: 'An error occurred while processing your request.' }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-500 text-white">
            <h2 className="text-3xl font-bold flex items-center justify-center">
              <FaLightbulb className="mr-2 animate-pulse text-yellow-300" />
              AI Tutor
              <FaBook className="ml-2 animate-bounce text-pink-300" />
            </h2>
          </div>
          <div ref={chatContainerRef} className="h-96 overflow-y-auto p-6 bg-gray-50">
            {chatHistory.map((entry, index) => (
              <div key={index} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'} mb-4 animate-fadeIn`}>
                <div className={`flex items-end max-w-[75%] ${entry.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${entry.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-pink-500 mr-2'} transition-transform duration-300 ease-in-out transform hover:scale-110 overflow-hidden`}>
                    {entry.role === 'user' ? (
                      user && user.image ? (
                        <img src={user.image} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-white" />
                      )
                    ) : (
                      <FaRobot className="text-white" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${entry.role === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'} shadow-md hover:shadow-lg transition-shadow duration-300`}>
                    {entry.parts[0].text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your question..."
                className="flex-grow px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-6 py-2 rounded-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <FaPaperPlane className="text-xl" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AITutor;