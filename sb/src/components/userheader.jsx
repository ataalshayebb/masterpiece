import React from 'react';

const Header = () => (
  <div className="bg-indigo-700 text-white p-4 flex justify-between items-center">
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-700">A</div>
      <button className="bg-white text-indigo-700 px-3 py-1 rounded">Start solo study</button>
    </div>
    <div className="flex items-center space-x-4">
      <span>5.2 h Monthly time</span>
      <span>Monthly level 4/12</span>
      <span>Streak 1</span>
      <button className="bg-red-500 text-white px-3 py-1 rounded">Return to room</button>
    </div>
  </div>
);

export default Header;
