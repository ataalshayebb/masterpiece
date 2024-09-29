import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faHome, faUserFriends, faEnvelope, faCircleInfo, faBell, faCheck, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import mp from '../assets/mplog.png';

const Navbar = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        fetchFriendRequests();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://localhost:5000/api/profile/user', {
                    headers: { 'x-auth-token': token }
                });
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchFriendRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('http://localhost:5000/api/friends/friend-requests', {
                    headers: { 'x-auth-token': token }
                });
                setFriendRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const acceptFriendRequest = async (friendId) => {
        try {
            console.log('Accepting friend request for friendId:', friendId);
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            const response = await axios.post('http://localhost:5000/api/friends/accept-request', 
                { friendId },
                { 
                    headers: { 'x-auth-token': token },
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if the status code is less than 500
                    }
                }
            );
            console.log('Response:', response);
            if (response.status === 200) {
                fetchFriendRequests(); // Refresh the friend requests
            } else {
                console.error('Error accepting friend request:', response.data);
               
                Swal.fire({
                    title: 'Error!',
                    text: `Failed to accept friend request: ${response.data.message}`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                  });
            }
        } catch (error) {
            console.error('Error accepting friend request:', error.response ? error.response.data : error.message);
          
            Swal.fire({
                title: 'Error!',
                text: 'Failed to accept friend request. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            
        }
    };

    const rejectFriendRequest = async (friendId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/friends/reject-request', 
                { friendId },
                { headers: { 'x-auth-token': token } }
            );
            fetchFriendRequests(); // Refresh the friend requests
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="sticky inset-0 z-50 border-b border-slate-100 bg-white/10 backdrop-blur-lg">
            <nav className="mx-auto flex w-[100%] h-20 gap-8 px-6 transition-all duration-200 ease-in-out py-1">
                <div className="relative flex items-center w-[25%]">
                    <Link to="/">
                        <img 
                            src={mp}
                            loading="lazy" 
                            style={{ color: 'transparent' }} 
                            width="195" 
                            height="195" 
                            alt="Logo" 
                        />
                    </Link>
                </div>
                <ul className="hidden w-[50%] items-center justify-center gap-12 md:flex">
                    <li className="pt-1.5 font-dm text-xl font-medium text-grey">
                        <Link to="/userhome">
                            <FontAwesomeIcon icon={faHome} className="text-2xl" />
                        </Link>
                    </li>
                    <li className="pt-1.5 font-dm text-xl font-medium text-grey">
                        <Link to="/friends">
                            <FontAwesomeIcon icon={faUserFriends} className="text-2xl" />
                        </Link>
                    </li>
                    <li className="pt-1.5 font-dm text-xl font-medium text-grey">
                        <Link to="/messages">
                            <FontAwesomeIcon icon={faEnvelope} className="text-2xl" />
                        </Link>
                    </li>
                    <li className="pt-1.5 font-dm text-xl font-medium text-grey">
                        <Link to="/community">
                            <FontAwesomeIcon icon={faCircleInfo} className="text-2xl" />
                        </Link>
                    </li>
                    {user && (
                        <li className="pt-1.5 font-dm text-xl font-medium text-grey relative">
                            <div onClick={() => setShowDropdown(!showDropdown)} className="cursor-pointer">
                                <FontAwesomeIcon icon={faBell} className="text-2xl" />
                                {friendRequests.length > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                                        {friendRequests.length}
                                    </span>
                                )}
                            </div>
                            {showDropdown && friendRequests.length > 0 && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10">
                                    {friendRequests.map((request) => (
                                        <div key={request._id} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex justify-between items-center">
                                            <span>{request.username}</span>
                                            <div>
                                                <button 
                                                    onClick={() => acceptFriendRequest(request._id)}
                                                    className="bg-green-500 text-white p-1 rounded mr-2"
                                                >
                                                    <FontAwesomeIcon icon={faCheck} />
                                                </button>
                                                <button 
                                                    onClick={() => rejectFriendRequest(request._id)}
                                                    className="bg-red-500 text-white p-1 rounded"
                                                >
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    )}
                </ul>
                <div className="flex-grow"></div>
                <div className="hidden w-[25%] items-center justify-end gap-6 md:flex">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/profile" 
                                className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
                            >
                                <img 
                                    src={user.image || 'https://via.placeholder.com/40'} 
                                    alt={user.username} 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="text-gray-700 font-medium">{user.username}</span>
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="text-gray-600 hover:text-gray-800 bg-gray-200 p-2 rounded-full transition-colors duration-200"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                            </button>
                        </div>
                    ) : (
                        <Link to='/login'>
                            <button 
                                className="px-4 py-2 font-semibold text-lg text-white rounded-full shadow-md transition-all duration-200 ease-in-out hover:scale-105 bg-pink-500 hover:bg-pink-600"
                            >
                                Log in
                            </button>
                        </Link>
                    )}
                </div>
                <div className="relative flex items-center justify-center md:hidden">
                    <button type="button">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth="1.5" 
                            stroke="currentColor" 
                            aria-hidden="true" 
                            className="h-6 w-auto text-white"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            ></path>
                        </svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;