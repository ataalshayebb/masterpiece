import React, { useRef, useState, useEffect } from "react";
   import { useParams, useLocation, useNavigate } from "react-router-dom";
   import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
   import { APP_ID, SECRET } from "../src/debate_settings";

   function Debate_Room() {
     const { roomId } = useParams();
     const location = useLocation();
     const navigate = useNavigate();
     const zpRef = useRef(null);
     const videoContainerRef = useRef(null);
     const [joined, setJoined] = useState(false);
     const [callType, setCallType] = useState("");

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
       zp.joinRoom({
         container: videoContainerRef.current,
         sharedLinks: [
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
         ],
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

     return (
       <div className="flex flex-col h-screen">
         {!joined && (
           <>
             <header className="bg-gray-800 text-white p-4 text-center text-xl">
               {callType === "one-on-one" ? "One-on-One Video Call" : "Group Video Call"}
             </header>
             <button
               className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded cursor-pointer"
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
       </div>
     );
   }

   export default Debate_Room;