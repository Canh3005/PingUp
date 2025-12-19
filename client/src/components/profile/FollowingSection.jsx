import React from "react";
import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FollowingSection = ({ following = [], onViewAll }) => {
  const navigate = useNavigate();
  if (!following || following.length === 0) return null;

  const displayFollowing = following.slice(0, 3);

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Following</h2>
        </div>
        <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-semibold">
          {following.length}
        </span>
      </div>

      <div className="space-y-3">
        {displayFollowing.map((user) => (
          <div
            key={user.userId}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group cursor-pointer"
            onClick={() => handleViewProfile(user.userId)}
          >
            <img
              src={user.avatarUrl || "https://via.placeholder.com/36"}
              alt={user.name}
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-white"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                {user.name}
              </p>
              {user.jobTitle && (
                <p className="text-xs text-gray-500 truncate">
                  {user.jobTitle}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {following.length > 3 && (
        <button
          onClick={() => onViewAll()}
          className="w-full mt-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm rounded-xl transition-all"
        >
          View all {following.length} following
        </button>
      )}
    </div>
  );
};

export default FollowingSection;
