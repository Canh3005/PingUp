import React from 'react';
import { Edit, Mail } from 'lucide-react';

const ProfileHeader = ({ userAvatar, userName, userRole, isOwnProfile, onEditClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <img
            src={userAvatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg -mt-14"
          />
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{userName}</h1>
            <p className="text-gray-600 mt-1">{userRole}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          {isOwnProfile ? (
            <button 
              onClick={onEditClick}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Invite to Project
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Follow
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
