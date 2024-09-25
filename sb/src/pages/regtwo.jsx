import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const CountryComponent = () => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/auth/register-country`,
        { userId, city },
        { headers: { 'x-auth-token': token } }
      );
      navigate('/regthree');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while updating country');
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-500 min-h-screen p-8">
      <h1 className="text-white text-3xl font-bold mb-2">👋 Welcome to Study Together! Tell us about yourself!</h1>
      <p className="text-white mb-4">Tell us about yourself, so that we can recommend you personalized study rooms and friends later on!</p>
      
      <div className="flex justify-end mb-4">
        <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
          2 of 3 Completed
          <div className="w-32 bg-white bg-opacity-30 rounded-full h-2 mt-1">
            <div className="bg-white w-2/3 h-2 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-8">
        <div className="flex mb-6">
          <div className="flex items-center mr-4">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white">✓</span>
            </div>
            <span className="ml-2 font-semibold">Education</span>
          </div>
          <div className="flex items-center mr-4">
            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
            <span className="ml-2 font-semibold">City</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
            <span className="ml-2 text-gray-500">Welcome</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">Great, thank you!<br />And where are you from? 🌍</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        <input 
          type="text" 
          placeholder="Please enter your city" 
          className="w-full border-2 border-gray-300 rounded-lg p-3 mb-8"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <div className="flex justify-between">
          <Link to="/regone">
            <button className="px-6 py-2 bg-red-400 text-white rounded-full">← Back</button>
          </Link>
          <button onClick={handleSubmit} className="px-6 py-2 bg-red-400 text-white rounded-full">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default CountryComponent;