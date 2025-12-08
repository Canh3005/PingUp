import React from "react";

const RecentMessages = ({ items = [] }) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-md">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Recent messages</h2>
      <div className="space-y-2">
        {items.map((it) => {
          const user = it.from_user_id || it.user || {};
          return (
            <div key={it._id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50">
              <img
                src={user.profile_picture || user.imageUrl}
                alt={user.username || "user"}
                className="w-9 h-9 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {user.full_name || user.username || "User"}
                </div>
                <div className="text-xs text-gray-500 truncate">{it.text || ""}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMessages;
