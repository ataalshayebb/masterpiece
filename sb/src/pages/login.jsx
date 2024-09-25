import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // The backend now returns { token, userId }
      const { token, userId,username } = response.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      navigate("/userhome");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-900 via-purple-900 to-pink-500">
      <div className="flex flex-col lg:flex-row items-center bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 lg:p-16 w-full max-w-4xl shadow-lg">
        <div className="w-full lg:w-1/2 lg:pr-8">
          <h1 className="text-white text-3xl font-bold mb-6">
            Hi, Welcome Back! <span>👋</span>
          </h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="p-3 border-2 border-gray-800 rounded-lg w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter Your Password"
              className="p-3 border-2 border-gray-800 rounded-lg w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors w-full"
            >
              Log In
            </button>
          </form>
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-600" />
            <span className="text-gray-300 mx-4">Or With</span>
            <hr className="flex-grow border-gray-600" />
          </div>
          <button className="bg-white bg-opacity-20 text-white py-3 rounded-lg w-full hover:bg-opacity-30 transition-colors">
            Login with Google
          </button>
          <p className="text-white mt-4">
            Don't have an account? <Link to="/signup" className="underline">Sign Up</Link>
          </p>
          <div className="mt-4">
            <Link to="/adminlogin">
              <button className="bg-green-600 text-white py-2 px-4 rounded-lg">
                Admin
              </button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/2">
          <img
            src="https://app.studytogether.com/images/welcome-form/country.svg"
            alt="Welcome"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;