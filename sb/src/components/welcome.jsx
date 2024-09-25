import React from 'react';
import videoSrc from '../assets/uhv.mp4'; 
const WelcomeSection = () => {
    return (
        <div className="mt-1">
            <div className="flex bg-white h-96 container mx-auto">
                <div className="flex items-center text-center lg:text-left px-8 md:px-12 lg:w-1/2">
                    <div>
                        <h2 className="text-3xl font-semibold text-gray-800 md:text-4xl">
                            Welcome back , <span className="text-pink-600">whatever.</span>
                        </h2>
                        <p className="mt-2 text-sm text-gray-500 md:text-base">
                        Introducing Premium Video Calling on StudyJo!

Experience seamless, high-quality video calls with friends and study partners. Connect face-to-face, collaborate in real-time, and enhance your learning experience like never before. Upgrade to our premium video calling feature today and unlock the full potential of your study sessions!

                        </p>
                        <div className="flex justify-center lg:justify-start mt-6">
                            <button className="md:mt-0 mt-2 md:mr-0 mr-2 bg-pink-500 px-5 py-3 rounded-xl text-sm text-white hover:text-white shadow-xl hover:shadow-xl hover:shadow-pink-300/80 shadow-pink-400/40 hover:bg-pink-600">Try it now</button>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 relative" style={{ clipPath: "polygon(10% 0, 100% 0%, 100% 100%, 0 100%)" }}>
                    <video autoPlay muted loop className="absolute inset-0 w-full h-full object-cover">
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="absolute inset-0 bg-black opacity-25"></div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;
