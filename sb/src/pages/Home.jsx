import React from 'react';
import Navbar from '../components/navBar';
import MainContent from '../components/herosection'
import StudentAvatars from '../components/studentsavatar'
import StudyRooms from '../components/studyroom';
import StudyBreakSection from '../components/three&four';
import StudySteps from './StudySteps';
import CustomerReviews from '../components/customer';
import StudyComponent from '../components/studycomp';
import Footer from '../components/footer';


const Home = () => {
  return (
    <div className="font-sans">
     <Navbar/>
      <MainContent />
      <StudentAvatars />
      <StudyRooms />
     
      <StudyComponent></StudyComponent>
   
      <CustomerReviews></CustomerReviews>
      <Footer></Footer>
    </div>
  );
};

export default Home;
