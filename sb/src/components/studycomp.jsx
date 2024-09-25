import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faBookOpen, faComments, faStar } from '@fortawesome/free-solid-svg-icons';
import ss1 from '../assets/studysession.png';
import ss3 from '../assets/ai.png';
import ss2 from '../assets/ss2.mp4';

const StudyComponent = () => {
  // Initialize selectedItem with 'materials' to select the first item by default
  const [selectedItem, setSelectedItem] = useState('materials');

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderImage = () => {
    switch (selectedItem) {
      case 'materials':
        return <img src={ss1} alt="Study Materials" />;
      case 'flashcards':
        return (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={ss2}
            autoPlay
            loop
            muted
            preload="auto"
          />
        );
      case 'community':
        return <img src={ss3} alt="Community" />;
      case 'rewards':
        return <img src="/path/to/rewards-image.jpg" alt="Rewards" />;
      default:
        return <p className="text-gray-500">Placeholder for application image</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <h1 className="text-4xl font-bold text-center mb-8">
       With Study together , Studying has never been easier
      </h1>

      <div className="flex space-x-8">
        <div className="w-1/2 space-y-4">
          <div
            className={`flex items-center space-x-4 p-4 rounded cursor-pointer ${selectedItem === 'materials' ? 'bg-gray-200' : ''}`}
            onClick={() => handleItemClick('materials')}
          >
            <FontAwesomeIcon icon={faFileAlt} className="text-2xl text-pink-500" />
            <p>Find all relevant study materials for your courses</p>
          </div>

          <div
            className={`flex items-center space-x-4 p-4 rounded cursor-pointer ${selectedItem === 'flashcards' ? 'bg-gray-200' : ''}`}
            onClick={() => handleItemClick('flashcards')}
          >
            <FontAwesomeIcon icon={faBookOpen} className="text-2xl text-pink-500" />
            <p>Learn more efficiently (e.g. with our flash card tool)</p>
          </div>

          <div
            className={`flex items-center space-x-4 p-4 rounded cursor-pointer ${selectedItem === 'community' ? 'bg-gray-200' : ''}`}
            onClick={() => handleItemClick('community')}
          >
            <FontAwesomeIcon icon={faComments} className="text-2xl text-pink-500" />
            <p>Find answers to your questions in our community</p>
          </div>

          <div
            className={`flex items-center space-x-4 p-4 rounded cursor-pointer ${selectedItem === 'rewards' ? 'bg-gray-200' : ''}`}
            onClick={() => handleItemClick('rewards')}
          >
            <FontAwesomeIcon icon={faStar} className="text-2xl text-pink-500" />
            <p>Share your study materials and receive great rewards</p>
          </div>

          <button className="bg-pink-500 text-white px-6 py-2 rounded-full mt-4">
            Sign up for free
          </button>
        </div>

        <div className="w-1/2">
          <div className="bg-gray-200 h-96 rounded-lg shadow-md flex items-center justify-center relative">
            {renderImage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyComponent;
