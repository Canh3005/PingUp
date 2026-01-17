import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, TrendingUp, Clock, Plus, Loader2 } from 'lucide-react';
import projectHubApi from '../api/projectHubApi';
import { useAuth } from '../context/authContext';

const MyHubs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hubs, setHubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyHubs();
  }, []);

  const loadMyHubs = async () => {
    try {
      setLoading(true);
      const response = await projectHubApi.getUserProjectHubs();
      setHubs(response.data || []);
    } catch (err) {
      console.error('Error loading hubs:', err);
      setError(err.response?.data?.message || 'Failed to load project hubs');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInMs = now - updated;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your project hubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Hubs</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadMyHubs}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              <div className="h-8 w-px bg-gray-200"></div>

              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>Project Hub</span>
                  <span>/</span>
                  <span className="text-gray-900 font-medium">My Hubs</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">My Project Hubs</h1>
              </div>
            </div>

            <button
              onClick={() => navigate('/project-hub/create')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/25"
            >
              <Plus className="w-5 h-5" />
              Create New Hub
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {hubs.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Project Hubs Yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Create your first project hub to start collaborating with your team and managing your projects effectively.
            </p>
            <button
              onClick={() => navigate('/project-hub/create')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-600/25"
            >
              <Plus className="w-5 h-5" />
              Create Your First Hub
            </button>
          </div>
        ) : (
          /* Hubs Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubs.map((hub) => (
              <div
                key={hub._id}
                onClick={() => navigate(`/project-hub/${hub._id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-200 hover:border-blue-300 overflow-hidden group"
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 p-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    {hub.logo ? (
                      <img
                        src={hub.logo}
                        alt={hub.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {hub.name}
                      </h3>
                      {hub.description && (
                        <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {hub.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Progress
                      </span>
                      <span className="font-semibold text-gray-900">{hub.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${hub.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{hub.members?.length || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(hub.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {hub.tags && hub.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hub.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                      {hub.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          +{hub.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHubs;
