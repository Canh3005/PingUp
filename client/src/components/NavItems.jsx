import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, Briefcase, MessageCircle, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { assets } from "../assets/assets";

const navItems = [
  { to: "/", label: "Explore", Icon: Home },
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/jobs", label: "Jobs", Icon: Briefcase },
  { to: "/message", label: "Message", Icon: MessageCircle },
];

const NavItems = ({ onNavigate, horizontal = false }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    if (onNavigate) onNavigate();
  };

  const userAvatar = user?.imageUrl || user?.profile_picture || assets.sample_profile;
  const userName = user?.username || user?.full_name || user?.email || "User";

  if (horizontal) {
    // Horizontal layout for Navbar with underline on active/hover
    return (
      <>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex items-center gap-2 px-1 mx-3 py-3 transition-colors text-gray-900 group ${
                isActive 
                  ? "border-b-3 border-gray-900" 
                  : "border-b-3 border-transparent hover:border-gray-700"
              }`
            }
            onClick={onNavigate}
            end={item.to === "/"}
          >
            <span className="text-[18px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </>
    );
  }

  // Vertical layout (original sidebar style)
  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 rounded-xl transition-colors cursor-pointer ${
                isActive ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100"
              }`
            }
            onClick={onNavigate}
            end={item.to === "/"}
          >
            <item.Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-3 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3">
          <img
            src={userAvatar}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border border-gray-300"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{userName}</div>
            <div className="text-xs text-gray-500 truncate">{user?.email || ""}</div>
          </div>
          <button
            aria-label="Logout"
            title="Logout"
            onClick={handleLogout}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavItems;
