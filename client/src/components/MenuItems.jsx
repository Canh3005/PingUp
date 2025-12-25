import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Users, MessageCircle, Search, UserIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/authContext.jsx";
import { assets } from "../assets/assets";

const navItems = [
  { to: "/", label: "Feed", Icon: Home },
  { to: "/connection", label: "Connection", Icon: Users },
  { to: "/message", label: "Message", Icon: MessageCircle },
  { to: "/discover", label: "Discover", Icon: Search },
  { to: "/profile", label: "Profile", Icon: UserIcon },
];

const NavItems = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
    if (onNavigate) onNavigate();
  };

  const userAvatar = user?.profile?.avatarUrl || assets.sample_profile;
  const userName = user?.profile?.name || "User";

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
