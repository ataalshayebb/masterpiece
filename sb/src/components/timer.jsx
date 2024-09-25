import React, { useState, useEffect } from 'react';

const StudyTimer = ({ defaultTime = 600 }) => {
  const [time, setTime] = useState(defaultTime);
  const [isRunning, setIsRunning] = useState(false);
  const [inputTime, setInputTime] = useState(defaultTime / 60); // Default time in minutes
  const [initialTime, setInitialTime] = useState(defaultTime); // Store the initial time

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTime(initialTime);
    setIsRunning(false);
  };

  const handleInputChange = (event) => {
    setInputTime(event.target.value);
  };

  const handleSetTime = () => {
    const newTime = parseInt(inputTime) * 60;
    if (!isNaN(newTime) && newTime > 0) {
      setTime(newTime);
      setInitialTime(newTime);
      setIsRunning(false);
    }
  };

  // Convert time to minutes and seconds
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Calculate the strokeDashoffset for the ring
  const strokeDasharray = 251.2; // Circumference of the circle
  const progress = (time / initialTime) * strokeDasharray;

  return (
    <div className="bg-gradient-to-r from-purple-200 to-purple-300 p-6 rounded-lg shadow-lg w-full md:w-64 flex flex-col items-center">
      <h3 className="text-2xl font-bold mb-4 text-gray-800">Study Timer</h3>
      <div className="relative w-40 h-40 mb-4">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            className="text-gray-300 stroke-current"
            strokeWidth="8"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          ></circle>
          <circle
            className="text-purple-600 progress-ring stroke-current"
            strokeWidth="8"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDasharray - progress}
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-3xl font-extrabold text-purple-600">
          {`${minutes}:${seconds.toString().padStart(2, '0')}`}
        </div>
      </div>
      <div className="w-full mt-4">
        <label className="block text-gray-800 font-medium mb-2 text-center" htmlFor="timeInput">
          Set Time (minutes)
        </label>
        <div className="flex flex-col items-center">
          <input
            type="number"
            id="timeInput"
            value={inputTime}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 w-full"
            placeholder="Minutes"
            min="1"
          />
          <button
            onClick={handleSetTime}
            className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors w-full"
          >
            Set Time
          </button>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={toggleTimer}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default StudyTimer;
