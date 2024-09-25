import React from 'react';
import bgviid from '../assets/bgviid.mp4'; // Adjust the path if necessary

const MainContent = () => {
  return (
    <main className="relative p-8 min-h-screen">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={bgviid}
        autoPlay
        loop
        muted
        preload="auto"
      />
      <div className="relative z-10 flex items-center justify-end p-8">
        <div className="w-1/2 p-8 text-black">
          <h1 className="text-6xl font-extrabold mb-6">
            There is waaay more to study
          </h1>
          <p className="mb-6 text-xl leading-relaxed font-bold">
            It's about time to enjoy studying! As part of a supportive community, you will feel inspired again and held accountable to reach your goals. Let us guide you through your study sessions, and celebrate your success with you. Together we go further!
          </p>
          <button className="bg-pink-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-pink-700 transition-colors">
            Join Study Together
          </button>
          <button className="text-gray-800 ml-4 text-lg hover:underline">
            Tell me more ↓
          </button>
        </div>
      </div>
    </main>
  );
};

export default MainContent;
