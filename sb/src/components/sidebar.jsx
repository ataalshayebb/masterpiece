import React from 'react';

const Sidebar = () => (
  <div className="w-16 bg-gray-100 h-screen flex flex-col items-center py-4 space-y-4">
    <div className="text-red-500"><i className="fas fa-network-wired"></i></div>
    <div className="text-red-500"><i className="fas fa-home"></i></div>
    <div><i className="fas fa-user"></i></div>
    <div><i className="fas fa-bullseye"></i></div>
    <div><i className="fas fa-comment"></i></div>
    <div><i className="fas fa-chart-bar"></i></div>
    <div><i className="fas fa-globe"></i></div>
  </div>
);

export default Sidebar;
