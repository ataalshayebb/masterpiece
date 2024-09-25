import React from 'react';

const reviews = [
  {
    name: "Jennifer Hill",
    date: "Apr 13, 2024",
    rating: "★★★★★",
    comment: "It’s so fast. I literally just press the button and it tells my answer in like 2 seconds. It doesn’t even feel like I’m in school anymore.",
  },
  {
    name: "Scott Moyer",
    date: "Dec 17, 2023",
    rating: "★★★★★",
    comment: "I wish I could do explanations instead of just showing me the answers. It is super helpful for studying.",
  },
  {
    name: "Adriana Madrigal",
    date: "Jan 7, 2024",
    rating: "★★★★★",
    comment: "The app works great but I think the support team is even better. I had trouble logging in so I sent them an email and they helped me right away. Thank you!!!",
  },
  {
    name: "Devyn Frost",
    date: "Mar 28, 2024",
    rating: "★★★★☆",
    comment: "If I would have had this in high school, I would have gotten a 4.0! They only thing I don’t like about it is that I am being forced to graduate.",
  },
  {
    name: "Mark Atty",
    date: "Feb 12, 2024",
    rating: "★★★★★",
    comment: "Love this app. I originally heard about it on TikTok so I decided to try it and it actually works. All my friends use it now too.",
  },
  {
    name: "Simon Sozzi",
    date: "Apr 16, 2024",
    rating: "★★★★☆",
    comment: "I didn’t use it at first because my friend showed me the lifesaver. I never thought it would integrate when it’s not integrated on the platform.",
  },
 
];

const CustomerReviews = () => {
  return (
    <div className="p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center">See What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-lg font-semibold">{review.name}</div>
            <div className="text-yellow-500">{review.rating}</div>
            <div className="text-sm text-gray-600 mb-2">{review.date}</div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-6 text-green-600">
        Google Reviews ★★★★★
      </div>
    </div>
  );
};

export default CustomerReviews;
