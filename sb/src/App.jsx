// import NavBar from './components/navBar';
// import Footer from './components/footer';
import SignUp from './pages/signup';
import Login from './pages/login';
// import Profile from './pages/profile';
import Home from './pages/Home';
import EducationComponent from './pages/regone';
import CountryComponent from './pages/regtwo';
import WelcomeComponent from './pages/regthree';
import CommunityPage from './pages/community';
import AITutor from './pages/tutor';
// import EventCatalog from './pages/eventCatalog';
// import EventDetails from './pages/eventDetails';
// import CheckOut from './pages/checkOut';
// import Confirmation from './pages/confirmation';
// import DashBoard from './pages/dashBoard';
// import ContactUs from './pages/contactUs';
// import AboutUs from './pages/aboutUs';
// import AdminLogin from './pages/adminlogin';
import {createBrowserRouter,RouterProvider} from 'react-router-dom' ;
import UserHome from './pages/userhome';
import Profile from './pages/profile';
import ChatInterface from './pages/messages';
import Friends from './pages/friends';
import Debate_Room from './debateroom';
import Debate_screen from './debatescreen';

function App(){
  const router = createBrowserRouter([
  {path:'/',element:<Home />}
  ,{path: '/regone',element:<EducationComponent/>}
  ,{path: '/regtwo',element:<CountryComponent/>}
  ,{path: '/regthree',element:<WelcomeComponent/>}
  ,{path: '/userhome',element:<UserHome/>}
  ,{path: '/profile',element:<Profile/>}
  ,{path: '/messages',element:<ChatInterface/>}
  ,{path: '/friends',element:<Friends/>}
  ,{path: '/tutor',element:<AITutor/>}
   ,{path:"/debate-screen" ,element:<Debate_screen />} ,
   ,{path:"/debate-room/:roomId" ,element:<Debate_Room />} 

  
  
  ,{path: '/community',element:<CommunityPage/>}
//  ,{path:'aboutus',element:<AboutUs/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'contactus',element:<ContactUs/> ,errorElement : <div>404 Not Found</div>}
 ,{path:'signup',element:<SignUp/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'catalog',element:<EventCatalog/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'eventdetails',element:<EventDetails/> ,errorElement : <div>404 Not Found</div>}
 ,{path:'login',element:<Login/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'checkout',element:<CheckOut/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'confirmation',element:<Confirmation/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'dashboard',element:<DashBoard/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'profile',element:<Profile/> ,errorElement : <div>404 Not Found</div>}
//  ,{path:'adminlogin',element:<AdminLogin/> ,errorElement : <div>404 Not Found</div>}

]);

return(
<>

<RouterProvider router={router}/>

</>

  )
}
export default App ;