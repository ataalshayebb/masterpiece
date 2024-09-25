// src/components/ChatHeader.js
import React from 'react';

const ChatHeader = ({ friendName }) => {
  return (
    <div className="bg-pink-500 text-white p-4">
      <h1 className="text-xl font-bold">Chat with {friendName || 'Select a friend'}</h1>
    </div>
  );
};

export default ChatHeader;
