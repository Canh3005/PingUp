import React, { useState, useEffect } from 'react';
import { X, Users, UserPlus, Loader2 } from 'lucide-react';
import followApi from '../../api/followApi';

const FollowModal = ({ isOpen, onClose, userId, type = 'followers' }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(type);

  useEffect(() => {
    if (isOpen && userId) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId, activeTab]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (activeTab === 'followers') {
        response = await followApi.getFollowers(userId, 1, 50);
      } else {
        response = await followApi.getFollowing(userId, 1, 50);
      }
      
      if (response.success) {
        setUsers(response.data[activeTab] || []);
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Connections</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'followers'
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Followers
            </div>
            {activeTab === 'followers' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'following'
                ? 'text-green-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <UserPlus className="w-4 h-4" />
              Following
            </div>
            {activeTab === 'following' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 ${activeTab === 'followers' ? 'bg-blue-50' : 'bg-green-50'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                {activeTab === 'followers' ? (
                  <Users className={`w-8 h-8 ${activeTab === 'followers' ? 'text-blue-400' : 'text-green-400'}`} />
                ) : (
                  <UserPlus className="w-8 h-8 text-green-400" />
                )}
              </div>
              <p className="text-gray-500 font-medium">
                No {activeTab} yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group cursor-pointer"
                >
                  <img
                    src={user.imageUrl || 'https://via.placeholder.com/40'}
                    alt={user.userName}
                    className="w-10 h-10 rounded-lg object-cover ring-2 ring-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {user.userName}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    )}
                    {user.type && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-white text-xs text-gray-600 rounded-md">
                        {user.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
