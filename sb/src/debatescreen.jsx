import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../src/components/navBar';
// import Swal from 'sweetalert2';

function Debate_screen() {
  const navigate = useNavigate();

  const generateRoomId = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now().toString().slice(-4);
    return randomId + timestamp;
  };

  const handleCall = (type) => {
    const roomId = generateRoomId();
    navigate(`/debate-room/${roomId}?type=${type}`);
  };

  const handleOneOnOneCall = () => {
    handleCall('one-on-one');
  };

  const handleGroupCall = () => {
    handleCall('group-call');
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-blue-50 font-sans">
        <div className="text-center">
          <h1 className="text-4xl mb-2 text-gray-800">Welcome to Study jo</h1>
          <p className="text-lg mb-5 text-gray-600">
            Start a video call with an automatically generated Room ID
          </p>
          <div className="flex justify-center mt-5">
            <button
              className="p-4 mx-2 bg-blue-500 text-white rounded text-lg hover:bg-blue-700 transition-colors duration-300"
              onClick={handleOneOnOneCall}
            >
              One-on-One Call
            </button>
            <button
              className="p-4 mx-2 bg-blue-500 text-white rounded text-lg hover:bg-blue-700 transition-colors duration-300"
              onClick={handleGroupCall}
            >
              Group Call
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Debate_screen;