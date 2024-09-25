import React from 'react';

const StudentAvatars = () => {
  const images = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVvcGxlJTIwZmFjZSUyMHBpY3N8ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://img.freepik.com/free-photo/headshot-skeptical-guy-looking-something-unamusing-grimacing-standing-reluctant-against-blue-background_1258-66604.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-photo/intriguing-mysterious-handsome-young-european-man-looks-curiously_273609-17036.jpg?size=626&ext=jpg",
    "https://img.freepik.com/premium-photo/causal-young-girl-with-detailed-skin-textured-face_1000823-134872.jpg?size=626&ext=jpg",
    "https://img.freepik.com/free-photo/handsome-guy-with-lotion-his-face_23-2149396109.jpg?size=626&ext=jpg&ga=GA1.2.1585403707.1722445727&semt=ais_hybrid",
    "https://img.freepik.com/free-photo/close-up-portrait-beautiful-blond-woman-with-blue-eyes-clean-glowing-facial-skin-touch-her-face-smiling-cute-front-concept-skincare-cosmetics-white-wall_176420-40514.jpg?ga=GA1.1.1585403707.1722445727&semt=ais_hybrid",
    "https://img.freepik.com/free-photo/portrait-happy-young-woman-standing-profile-turn-head-camera-looking-with-joyful-smile-white-teeth-standing-against-white-background_176420-48841.jpg?ga=GA1.1.1585403707.1722445727&semt=ais_hybrid",
    "https://img.freepik.com/premium-photo/portrait-smiling-arab-teenage-boy-with-dark-hair-wearing-white-tshirt-plain-background-diversity-youth-themes_91645-4045.jpg?ga=GA1.1.1585403707.1722445727&semt=ais_hybrid",
    "https://img.freepik.com/free-photo/portrait-young-smiling-man-standing-happily-looking-aside-white-background_574295-132.jpg?ga=GA1.1.1585403707.1722445727&semt=ais_hybrid"
  ];

  const allImages = [...images, ...images.slice(0, 8)]; // Repeat some images to make a total of 18

  return (
    <div className="mb-28 ml-8 mt-14">
      <h2 className="text-2xl font-bold mb-8">1. Meet other students and make new friends!</h2>
      <p className="text-gray-600 mb-4">Find students in the same educational level as you and with similar studying needs.</p>
      <div className="flex flex-wrap gap-6 ml-10">
        {allImages.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Student Avatar ${i + 1}`}
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 shadow-lg transform transition-transform duration-300 hover:scale-105"
          />
        ))}
      </div>
    </div>
  );
};

export default StudentAvatars;
