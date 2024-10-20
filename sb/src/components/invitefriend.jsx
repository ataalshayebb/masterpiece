import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InviteFriendPopup = ({ friends, sessionId, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteSent, setInviteSent] = useState({});
  const navigate = useNavigate();

  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendInvite = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const inviteLink = `${window.location.origin}/join-study-session/${sessionId}`;
      
      await axios.post('http://localhost:5000/api/messages', {
        senderId: userId,
        receiverId: friendId,
        content: JSON.stringify({
          type: 'study-session-invite',
          sessionId: sessionId,
          text: 'Join my study session!',
          link: inviteLink
        })
      }, {
        headers: { 'x-auth-token': token }
      });
      setInviteSent(prev => ({ ...prev, [friendId]: true }));
      
      // Navigate to the study session after successfully sending the invite
      navigate(`/join-study-session/${sessionId}`);
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Invite a Friend</h2>
        <input
          type="text"
          placeholder="Search friends..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="max-h-60 overflow-y-auto">
          {filteredFriends.map(friend => (
            <div key={friend._id} className="flex items-center justify-between mb-2">
              <span>{friend.username}</span>
              <button
                onClick={() => sendInvite(friend._id)}
                disabled={inviteSent[friend._id]}
                className={`px-3 py-1 rounded ${
                  inviteSent[friend._id] ? 'bg-gray-300' : 'bg-blue-500 text-white'
                }`}
              >
                {inviteSent[friend._id] ? 'Invited' : 'Invite'}
              </button>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default InviteFriendPopup;