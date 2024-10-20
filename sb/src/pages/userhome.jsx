import React from 'react';
import Navbar from '../components/navBar';
import Discord from '../components/mainuser';
import FriendsList from '../components/friends';
import DynamicStudySession from '../components/studysession';
import PeopleYouMayKnow from '../components/people';
import WelcomeSection from '../components/welcome';
import DidYouKnow from '../components/didyou';
import Footer from '../components/footer';

const UserHome = () => (
  <div className="flex flex-col h-screen">
    <Navbar />
    <WelcomeSection className="flex-1 mb-10" />
    <div className="flex flex-col md:flex-row mt-8 space-y-8 md:space-y-0 md:space-x-8 px-4">
      <div className="flex-1 space-y-8">
        <PeopleYouMayKnow className="w-full" />
        <Discord className="w-full" />
        <div className="flex justify-center">
          <div className="w-full mb-10 max-w-4xl">
            <DynamicStudySession />
          </div>
        </div>
      </div>
      <div className="w-full md:w-64 space-y-8">
        <FriendsList />
        <DidYouKnow />
      </div>
    </div>
    <Footer></Footer>
  </div>
);

export default UserHome;