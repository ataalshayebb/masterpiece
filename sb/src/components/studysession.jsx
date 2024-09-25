import React from 'react';
import StudyTimer from './timer';
import GoalsList from './userlist';
import { Link } from "react-router-dom";

const StudySession = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg shadow-lg space-y-6"  data-aos="fade-up">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Start your study session !</h2>
      
      <div className="flex flex-wrap justify-center space-x-6">
        <div className="flex-1">
          <StudyTimer />
        </div>
        <div className="flex-1">
          <GoalsList />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-4">Stuck and need an answer?</h2>
      <div className="flex space-x-4 mt-6">
        <Link to ='/tutor'>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors">
          Ask Gemini
        </button>
        </Link>
        <Link to ='/messages'>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors">
          Friends Help
        </button>
        </Link>
      </div>
    </div>
  );
};

export default StudySession;
