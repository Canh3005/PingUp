import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Briefcase } from 'lucide-react'
import { useAuth } from '../context/authContext.jsx'
import { assets } from '../assets/assets.js'
import NavItems from './NavItems.jsx'

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setShowMenu(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowMenu(false);
    }, 200); // 200ms delay before hiding
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userAvatar = user?.imageUrl || user?.profile_picture || assets.sample_profile;
  const userName = user?.username || user?.userName || user?.full_name || user?.email || "User";
  
  // Check if user has completed onboarding
  const hasCompletedOnboarding = user?.type && user?.topics && user?.topics.length > 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-1 border-gray-200">
      <div className="max-w-8xl ml-1 px-4">
        <div className={`flex`+(!hasCompletedOnboarding ? " justify-between h-14" : "")}>
          {/* Logo */}
          <div className="flex items-center mr-5">
            <img 
              src={assets.logo} 
              alt="Logo" 
              className="h-13 cursor-pointer" 
              onClick={() => navigate("/")} 
            />
          </div>

          {/* Center Navigation - Only show if onboarding completed */}
          {hasCompletedOnboarding && (
            <div className="hidden md:flex items-center space-x-1 mr-250">
              <NavItems horizontal={true} />
            </div>
          )}

          {/* Right: User Info */}
          <div className="flex items-center gap-3">
            {hasCompletedOnboarding ? (
              <>
                <div className="relative">
                  <img
                    src={userAvatar}
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover border border-gray-300 cursor-pointer hover:ring-2 hover:ring-gray-900 transition-all"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                  
                  {/* Popup Menu */}
                  {showMenu && (
                    <div 
                      className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* Menu Items */}
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          navigate("/profile");
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-3 text-left cursor-pointer"
                      >
                        <User className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Pingup Profile</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          navigate("/projects");
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-3 text-left cursor-pointer"
                      >
                        <Briefcase className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Manage Freelance Projects</span>
                      </button>
                      
                      {/* Divider */}
                      <div className="my-2 border-t border-gray-200"></div>
                      
                      {/* Sign Out */}
                      <button
                        onClick={() => {
                          setShowMenu(false);
                          handleLogout();
                        }}
                        className="w-full px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-3 text-left cursor-pointer"
                      >
                        <LogOut className="w-5 h-5 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{userName}</div>
                </div>
              </>
            ) : (
              <div className="text-lg font-semibold text-gray-900">
                Welcome, {userName}!
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
