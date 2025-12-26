import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Briefcase, Bell, Plus } from 'lucide-react'
import { useAuth } from '../context/authContext.jsx'
import { assets } from '../assets/assets.js'
import NavItems from './NavItems.jsx'

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
    }, 200);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const userAvatar = user?.profile?.avatarUrl || assets.sample_profile;
  const userName = user?.userName || user?.profile?.name || "User";

  const hasCompletedOnboarding = user?.type && user?.topics && user?.topics.length > 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-8xl mx-auto px-4 sm:px-6">
        <div className={`flex items-center ${!hasCompletedOnboarding ? "justify-between" : ""} h-16`}>
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={assets.logo}
              alt="Logo"
              className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Center Navigation */}
          {hasCompletedOnboarding && (
            <div className="hidden md:flex items-center flex-1 justify-center">
              <NavItems horizontal={true} />
            </div>
          )}

          {/* Right: Actions & User Info */}
          <div className="flex items-center gap-2">
            {hasCompletedOnboarding ? (
              <>
                {/* Create Button */}
                <button
                  onClick={() => navigate('/create-project')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                      <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 overflow-hidden">
                        <div className="px-4 pb-3 border-b border-gray-100">
                          <h3 className="font-semibold text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          <div className="px-4 py-8 text-center text-gray-500 text-sm">
                            No new notifications
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* User Avatar & Menu */}
                <div className="relative">
                  <button
                    className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-100 transition-all"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={userAvatar}
                      alt="avatar"
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-gray-100"
                    />
                    <span className="hidden md:block text-sm font-medium text-gray-700 pr-1">
                      {userName}
                    </span>
                  </button>

                  {/* Popup Menu */}
                  {showMenu && (
                    <div
                      className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={userAvatar}
                            alt="avatar"
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">{userName}</p>
                            <p className="text-sm text-gray-500">View your profile</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            navigate("/profile");
                          }}
                          className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                        >
                          <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">My Profile</span>
                            <span className="text-xs text-gray-500">View and edit your profile</span>
                          </div>
                        </button>

                        <button
                          onClick={() => {
                            setShowMenu(false);
                            navigate("/project-hub");
                          }}
                          className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                        >
                          <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Briefcase className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900 block">Project Hub</span>
                            <span className="text-xs text-gray-500">Manage your projects</span>
                          </div>
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="my-1 border-t border-gray-100"></div>

                      {/* Sign Out */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowMenu(false);
                            handleLogout();
                          }}
                          className="w-full px-4 py-3 hover:bg-red-50 transition-colors flex items-center gap-3 text-left group"
                        >
                          <div className="w-9 h-9 bg-gray-100 group-hover:bg-red-100 rounded-xl flex items-center justify-center transition-colors">
                            <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
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
