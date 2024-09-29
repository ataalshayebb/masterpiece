import React, { useRef, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from 'axios';
import io from 'socket.io-client';
import { APP_ID, SECRET } from "../src/debate_settings";
import Navbar from "./components/navBar";

function Debate_Room() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);
  const socketRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [callType, setCallType] = useState("");
  const [friends, setFriends] = useState([]);
  const [sharedLinks, setSharedLinks] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:5000');

    // Listen for incoming links
    socketRef.current.on('receive_link', (links) => {
      setSharedLinks(links);
    });

    return () => {
      // Clean up socket connection on component unmount
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/friends/friends', {
          headers: { 'x-auth-token': token }
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };
    fetchFriends();
  }, []);

  const myMeeting = (type) => {
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      APP_ID,
      SECRET,
      roomId,
      Date.now().toString(),
      "Your Name"
    );
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    const sharedLinksConfig = [
      {
        name: "Video Call Link",
        url:
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?type=" +
          encodeURIComponent(type),
      },
    ];

    zp.joinRoom({
      container: videoContainerRef.current,
      sharedLinks: sharedLinksConfig,
      scenario: {
        mode: type === "one-on-one" ? ZegoUIKitPrebuilt.OneONoneCall : ZegoUIKitPrebuilt.GroupCall,
      },
      maxUsers: type === "one-on-one" ? 2 : 10,
      onJoinRoom: () => {
        setJoined(true);
      },
      onLeaveRoom: () => {
        navigate("/debate-screen");
      },
    });

    setSharedLinks(sharedLinksConfig);
    // Emit the links to all connected clients
    socketRef.current.emit('share_link', sharedLinksConfig);
  };

  const handleExit = () => {
    if (zpRef.current) {
      zpRef.current.destroy();
    }
    navigate("/debate-screen");
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");
    setCallType(type);
  }, [location.search]);

  useEffect(() => {
    if (callType) {
      myMeeting(callType);
    }
    return () => {
      if (zpRef.current) {
        zpRef.current.destroy();
      }
    };
  }, [callType, roomId, navigate]);

  const sendLinkToFriend = async (friendId) => {
    if (sharedLinks.length > 0) {
      const link = sharedLinks[0].url;
      const message = {
        type: 'video-link',
        text: 'Join me in a video call',
        link: link
      };
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        await axios.post('http://localhost:5000/api/messages', {
          senderId: userId,
          receiverId: friendId,
          content: JSON.stringify(message)
        }, {
          headers: { 'x-auth-token': token }
        });
        Swal.fire({
          title: 'Success!',
          text: 'link sent successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Error sending link:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to send link. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'No link available to send. Please join the room first.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <>
    {/* <Navbar></Navbar> */}
    <div className="flex flex-col h-screen">
      {!joined && (
        <>
        
          <header className="bg-gray-800 text-white p-4 text-center text-xl">
            {callType === "one-on-one" ? "One-on-One Video Call" : "Group Video Call"}
          </header>
          <button
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleExit}
          >
            Exit
          </button>
        </>
      )}
      <div
        ref={videoContainerRef}
        className="flex flex-1 justify-center items-center h-[calc(100vh-3rem)]"
      />
      
      <div className="m-4 p-4 bg-white shadow rounded">
        {sharedLinks && sharedLinks.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Shared Links:</h2>
            <ul>
              {sharedLinks.map((link, index) => (
                <li key={index} className="mb-1">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <h2 className="text-lg font-semibold mb-2">Friends:</h2>
        <ul className="space-y-2">
          {friends.map(friend => (
            <li key={friend._id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <div className="flex items-center">
                {friend.image && <img src={friend.image} alt={friend.username} className="w-8 h-8 rounded-full mr-2" />}
                <span>{friend.username}</span>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => sendLinkToFriend(friend._id)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Send Link
                </button>
                <Link to={`/messages`}>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Message
                  </button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
}

export default Debate_Room;