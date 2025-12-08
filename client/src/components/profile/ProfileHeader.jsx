import React from 'react';
import { Edit, Mail, UserPlus } from 'lucide-react';

const ProfileHeader = ({ userAvatar, userName, userRole, isOwnProfile, onEditClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {/* Avatar */}
        <div className="relative -mt-20 sm:-mt-16">
          <img
            src={userAvatar}
            alt="Profile"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-xl object-cover"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
        </div>

        {/* Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{userName}</h1>
              <p className="text-gray-600 mt-1 font-medium">{userRole}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  onClick={onEditClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium">
                    <UserPlus className="w-4 h-4" />
                    Follow
                  </button>
                  <button className="px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-gray-700">
                    Invite to Project
                  </button>
                  <button className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all">
                    <Mail className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
