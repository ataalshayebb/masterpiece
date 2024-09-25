import React from 'react';

const StudyRooms = () => {
  return (
    <div className="mb-14">
        <h2 className="text-2xl font-bold mb-8 ml-8">2. Choose a room & meet other students</h2>
      <div className="bg-indigo-900 text-white p-4 rounded-lg mb-8">
        <h3 className="font-bold">Solo study</h3>
        <p>100% focus? Set the scene with atmospheric backgrounds, use timer and goal setting and study in your solo study room.</p>
        <button className="bg-pink-500 text-white px-4 py-2 rounded-full mt-2">Start a solo session</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {/* Add more study room options here */}
      </div>
    </div>
  );
};

export default StudyRooms;
