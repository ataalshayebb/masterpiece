import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const PeopleCard = ({ image, username, title, level, country, onConnect, _id }) => (
  <div className="bg-white rounded-lg shadow-md p-3 flex items-center space-x-3 transition-transform transform hover:scale-105 hover:shadow-lg h-24">
    <img src={image || 'https://via.placeholder.com/100'} alt={username} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
    <div className="flex-grow min-w-0">
      <h3 className="font-semibold text-sm leading-tight truncate">{username}</h3>
      <p className="text-xs text-gray-600 truncate">{title}</p>
      <p className="text-xs text-gray-500 truncate">{level} • {country}</p>
    </div>
    <button 
      className="bg-pink-500 text-white p-1.5 rounded-lg hover:bg-pink-600 transition-colors w-8 h-8 flex items-center justify-center flex-shrink-0"
      onClick={() => onConnect(_id)}
      aria-label="Connect"
    >
      <FontAwesomeIcon icon={faUserPlus} className="text-sm" />
    </button>
  </div>
);

const PeopleYouMayKnow = () => {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await axios.get('http://localhost:5000/api/friends/suggestions', {
        headers: { 'x-auth-token': token }
      });
      console.log('Suggestions received:', response.data);
      setPeople(response.data);
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred while fetching user suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      await axios.post('http://localhost:5000/api/friends/send-request', 
        { friendId },
        { headers: { 'x-auth-token': token } }
      );
      setPeople(people.filter(person => person._id !== friendId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const settings = {
    dots: true,
    infinite: people.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: people.length > 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: people.length > 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: people.length > 1,
        }
      }
    ]
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading suggestions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">Error: {error}</div>;
  }

  if (people.length === 0) {
    return <div className="text-center p-4">There are no similar students at the moment.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto relative p-4">
      <h2 className="text-2xl font-bold mb-6">Students you may know:</h2>
      <Slider {...settings}>
        {people.map((person) => (
          <div key={person._id} className="px-2">
            <PeopleCard {...person} onConnect={handleConnect} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PeopleYouMayKnow;