import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

const PeopleCard = ({ image, username, title, level, country }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transition-transform transform hover:scale-105 hover:shadow-lg">
    <img src={image || 'https://via.placeholder.com/100'} alt={username} className="w-16 h-16 rounded-full object-cover" />
    <div className="flex-grow">
      <h3 className="font-semibold text-lg">{username}</h3>
      <p className="text-sm text-gray-600">{title}</p>
      <p className="text-sm text-gray-500">{level} • {country}</p>
    </div>
    <button className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors">
      <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
      Connect
    </button>
  </div>
);

const PeopleYouMayKnow = () => {
  const [people, setPeople] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchPeople();
  }, []);

  const settings = {
    dots: true,
    infinite: people.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: people.length > 2,
          dots: true
        }
      },
      {
        breakpoint: 600,
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
    <div className="max-w-4xl mx-auto relative p-4">
      <h2 className="text-2xl font-bold mb-4">Students you may know:</h2>
      <Slider {...settings}>
        {people.map((person) => (
          <div key={person._id} className="px-2">
            <PeopleCard {...person} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default PeopleYouMayKnow;