import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeComponent = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-500 min-h-screen p-8">
      <h1 className="text-white text-3xl font-bold mb-2">👋 Welcome to Study Together! Tell us about yourself!</h1>
      <p className="text-white mb-4">Tell us about yourself, so that we can recommend you personalized study rooms and friends later on!</p>
      
      <div className="flex justify-end mb-4">
        <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-full">
          3 of 3 Completed
          <div className="w-32 bg-white bg-opacity-30 rounded-full h-2 mt-1">
            <div className="bg-white w-full h-2 rounded-full"></div>
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
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white">✓</span>
            </div>
            <span className="ml-2 font-semibold">Country</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
            <span className="ml-2 font-semibold">Welcome</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold mb-6">
          Perfect, nice to meet you! 😎<br />
          Welcome to Study Together! ❤️
        </h2>
        
        <div className="flex justify-end mt-8">
        <Link to="/userhome">
            <button className="px-6 py-2 bg-red-400 text-white rounded-full">Next →</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomeComponent;