import React, { useState, useEffect } from 'react';

const DidYouKnow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [
    { id: 1, content: "The first computer programmer was a woman named Ada Lovelace." },
    { id: 2, content: "The first computer bug was an actual moth found in a Harvard Mark II computer in 1947." },
    { id: 3, content: "The programming language Python is named after Monty Python, not the snake." },
    { id: 4, content: "The first webcam was created to check the status of a coffee pot." },
    { id: 5, content: "The first computer mouse was made of wood." },
    { id: 6, content: "The QWERTY keyboard layout was designed to slow down typing." },
    { id: 7, content: "The first 1GB hard drive weighed about 550 pounds." },
    { id: 8, content: "The term 'bug' in computer science was coined by Grace Hopper in 1947." },
    { id: 9, content: "The first computer game was created in 1961 called 'Spacewar!'." },
    { id: 10, content: "The '@' symbol is called an 'arroba' in Spanish." },
    // Add more cards as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % (cards.length - 2));
    }, 5000); // Change card every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-2 border-pink-500 rounded-lg p-4 h-[32rem] overflow-hidden">
      <h2 className="text-pink-500 font-bold text-xl mb-6">Did You Know?</h2>
      <div className="relative h-[calc(100%-2rem)]">
        {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
          <div
            key={card.id}
            className={`absolute w-full transition-all duration-500 ease-in-out ${
              index === 0 ? 'opacity-100' : index === 1 ? 'opacity-85' : 'opacity-70'
            }`}
            style={{
              top: `${index * 33.33}%`,
            }}
          >
            <div className="bg-white rounded-lg p-4 shadow-md border border-gray-200 h-28 mx-2">
              <p className="text-sm">{card.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DidYouKnow;