import React, { useState } from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import LoginForm from "../components/LoginForm.jsx";
import RegisterForm from "../components/RegisterForm.jsx";

const Home = () => {

  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <img
        src={assets.bgImage}
        alt=""
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover"
      />
      {/* Left Section - Branding */}
      <div className="flex-1 flex flex-col justify-between items-start p-4 md:p-16 lg:p-24 md:mb-30 lg:mb-40">
        <img src={assets.logo} alt="Pingup Logo" className="w-43 mb-6" />
        <div className="flex flex-col">
          <div className="flex flex-row items-center mb-4 gap-4">
            <img src={assets.group_users} alt="" className="w-25" />
            <div className="flex flex-col">
              <div className="flex flex-row gap-1">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-5 text-transparent fill-amber-500"
                    />
                  ))}
              </div>
              <div className="text-[#1C398E] text-xl font-semi mb-2">
                Join Pingup Today!
              </div>
            </div>
          </div>
          <div className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-gray-950 to-gray-800 bg-clip-text text-transparent">
            More than just connections, collaborate, and innovate.
          </div>
          <div className="text-2xl md:text-3xl text-gray-800 mb-6">
            Connect with like-minded creators, share your projects, and bring ideas to life together on Pingup.
          </div>
        </div>
      </div>
      {/* Right Section - Auth Forms (toggle by mode) */}
      {mode === "login" ? (
        <LoginForm setMode={setMode} />
      ) : (
        <RegisterForm setMode={setMode} />
      )}
    </div>
  );
};

export default Home;
