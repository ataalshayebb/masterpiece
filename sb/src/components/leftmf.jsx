// src/components/FriendsList.js
import React from 'react';

const FriendsList = ({ friends, selectedFriend, onSelectFriend }) => {
  return (
    <div className="w-1/4 bg-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">Friends</h2>
      {friends.map((friend) => (
        <div
          key={friend.id}
          onClick={() => onSelectFriend(friend.id)}
          className={`p-2 cursor-pointer ${selectedFriend === friend.id ? 'bg-pink-500 text-white' : 'bg-white'}`}
        >
          {friend.name}
        </div>
      ))}
    </div>
  );
};

export default FriendsList;
