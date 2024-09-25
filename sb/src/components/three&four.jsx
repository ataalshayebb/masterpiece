import React from 'react';

const StudyBreakSection = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 mb-26">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          3. „I'm stuck.<br />Heeelp!"
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Oh, it happens to all of us. Feeling unmotivated, stressed, or stuck on an assignment? Our community and <span className="text-red-500 font-semibold">tutors</span> are <span className="font-semibold">here for you :)</span>
        </p>
        <div className="relative">
          <img src="/path-to-math-background.jpg" alt="Math background" className="w-full h-auto rounded-lg" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-4">
              <span className="text-6xl">❓</span>
            </div>
          </div>
          {/* Add more circular images for people here */}
        </div>
      </div>
      
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          4. Have a break or get ready to rock!
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Resting your mind is just as crucial for success as the study itself. Join the <span className="text-red-500 font-semibold">Together Sessions</span> for a <span className="font-semibold">mindfulness</span> session or a <span className="font-semibold">boot camp</span>, or browse through a <span className="font-semibold">collection of audios and videos</span> with meditation and breathing exercises.
        </p>
        <div className="flex gap-4">
          <img src="/path-to-meditation-image.jpg" alt="Meditation" className="w-1/2 h-40 object-cover rounded-lg" />
          <img src="/path-to-exercise-image.jpg" alt="Exercise" className="w-1/2 h-40 object-cover rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default StudyBreakSection;