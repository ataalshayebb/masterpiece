import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateStudySession = () => {
  const navigate = useNavigate();

  const handleCreateSession = () => {
    navigate('/study-session');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Create a New Study Session</h1>
      <button
        onClick={handleCreateSession}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
      >
        Start Session
      </button>
    </div>
  );
};

export default CreateStudySession;