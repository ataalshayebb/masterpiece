import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const EducationComponent = () => {
  const [level, setLevel] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/auth/register-education`,
        { userId, level },
        { headers: { 'x-auth-token': token } }
      );
      navigate('/regtwo');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while updating education');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-500 min-h-screen p-8">
      <h1 className="text-white text-3xl font-bold mb-2">👋 Welcome to Study Together! Tell us about yourself!</h1>
      <p className="text-white mb-4">Tell us about yourself, so that we can recommend you personalized study rooms and friends later on!</p>
      
      <div className="flex justify-end mb-4">
        <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
          1 of 3 Completed
          <div className="w-32 bg-white bg-opacity-30 rounded-full h-2 mt-1">
            <div className="bg-white w-1/3 h-2 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-8">
        <div className="flex mb-6">
          <div className="flex items-center mr-4">
            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
            <span className="ml-2 font-semibold">Education</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span className="ml-2 text-gray-500">City</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span className="ml-2 text-gray-500">Welcome</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Are you a Tawjihi or a University student? 🖥️</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <div className="space-y-4 mb-8">
          {['tawjihi', 'bachelors', 'masters'].map((option) => (
            <div key={option} className="flex items-center">
              <input 
                type="radio" 
                id={option} 
                name="education" 
                value={option}
                onChange={(e) => setLevel(e.target.value)}
                className="w-6 h-6 mr-3" 
              />
              <label htmlFor={option}>{option}</label>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between">
          <button onClick={handleSubmit} className="px-6 py-2 bg-red-400 text-white rounded-full">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default EducationComponent;