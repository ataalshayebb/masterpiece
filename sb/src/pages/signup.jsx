import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phonenumber: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      navigate('/regone');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-purple-900 to-pink-500">
      <div className="flex flex-col lg:flex-row items-center bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-md max-w-4xl w-full">
        <div className="flex flex-col justify-center items-center p-10 lg:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Create an account</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="w-full space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Enter Your Username"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phonenumber"
              placeholder="Enter Your Phone Number"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              onChange={handleChange}
            />
            <button type="submit" className="w-full mt-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
              Sign Up
            </button>
          </form>
          <p className="text-white mt-6 text-center">
            Already have an account? <Link to="/login" className="text-pink-500 underline">Login</Link>
          </p>
        </div>
        <div className="flex justify-center items-center lg:w-1/2">
          <img
            src="https://app.studytogether.com/images/welcome-form/country.svg"
            alt="Welcome"
            className="object-contain h-full p-4"
          />
        </div>
      </div>
    </div>
  );
}

export default SignUp;