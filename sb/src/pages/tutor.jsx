import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaGraduationCap } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-pink-100">
          <div className="p-6 bg-white border-b border-pink-100">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">
              <FaGraduationCap className="mr-2 text-pink-400" />
              AI Tutor
            </h2>
          </div>
          <div ref={chatContainerRef} className="h-[32rem] overflow-y-auto p-6 bg-white">
            {chatHistory.map((entry, index) => (
              <div key={index} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex items-end max-w-[75%] ${entry.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${entry.role === 'user' ? 'bg-pink-100 ml-2' : 'bg-gray-100 mr-2'}`}>
                    {entry.role === 'user' ? (
                      user && user.image ? (
                        <img src={user.image} alt={user.username} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <FaUser className="text-pink-400" />
                      )
                    ) : (
                      <FaRobot className="text-gray-400" />
                    )}
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${entry.role === 'user' ? 'bg-pink-50 text-gray-800' : 'bg-gray-100 text-gray-800'}`}>
                    {entry.parts[0].text}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-pink-100">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your question..."
                className="flex-grow px-4 py-2 rounded-full border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                className={`px-6 py-2 rounded-full ${isLoading ? 'bg-gray-200 cursor-not-allowed' : 'bg-pink-400 hover:bg-pink-500'} text-white focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all duration-300`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <FaPaperPlane className="text-lg" />
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