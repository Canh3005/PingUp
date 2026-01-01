import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  Calendar,
  MessageSquare,
  Heart,
  Eye,
  ArrowRight,
  Plus,
  Loader2
} from 'lucide-react';
import devlogApi from '../../../api/devlogApi';
import hubActivityApi from '../../../api/hubActivityApi';

const OverviewTab = ({ project, milestones }) => {
  const [recentDevlogs, setRecentDevlogs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load data when project changes
  useEffect(() => {
    if (project?._id) {
      loadData();
    }
  }, [project]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch recent devlogs and activities in parallel
      const [devlogsData, activitiesData] = await Promise.all([
        devlogApi.getRecentDevlogs(project._id, 3),
        hubActivityApi.getRecentActivities(project._id, 5)
      ]);

      setRecentDevlogs(devlogsData);
      setRecentActivity(activitiesData);
    } catch (err) {
      console.error('Error loading overview data:', err);
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Quick tasks
  const quickTasks = [
    { id: 1, title: 'Fix camera shake bug', priority: 'high', assignee: 'Mike Johnson' },
    { id: 2, title: 'Add tutorial tooltips', priority: 'medium', assignee: 'Sarah Kim' },
    { id: 3, title: 'Optimize texture loading', priority: 'high', assignee: 'Alex Chen' },
    { id: 4, title: 'Record explosion SFX', priority: 'low', assignee: 'Emily Wang' },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Left Column - 60% */}
      <div className="lg:col-span-3 space-y-6">
        {/* Latest Devlogs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Latest Devlogs</h2>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
              <Plus size={16} />
              Create Update
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : recentDevlogs.length > 0 ? (
              recentDevlogs.map((devlog) => (
                <div
                  key={devlog._id}
                  className="group flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {devlog.media && devlog.media[0] && (
                    <img
                      src={devlog.media[0].url}
                      alt={devlog.title}
                      className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {devlog.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {devlog.content?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={devlog.author?.avatarUrl || 'https://via.placeholder.com/50'}
                          alt={devlog.author?.name}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-xs text-gray-500">{devlog.author?.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(devlog.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Heart size={12} /> {devlog.reactions?.heart || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No devlogs yet</p>
            )}
          </div>

          <button className="w-full mt-4 py-2 text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center justify-center gap-2">
            View All Devlogs <ArrowRight size={16} />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <p className="text-sm text-gray-600 flex-1">
                    <span className="font-medium text-gray-900">{activity.user?.name || 'User'}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium text-blue-600">{activity.targetName || activity.details}</span>
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(activity.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - 40% */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Project Progress</h3>
            <TrendingUp size={20} className="opacity-80" />
          </div>

          <div className="flex items-end gap-3 mb-4">
            <span className="text-4xl font-bold">{project.progress}%</span>
            <span className="text-blue-200 text-sm mb-1">completed</span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-blue-200">
              <CheckCircle2 size={14} className="inline mr-1" />
              {project.completedTasks} done
            </span>
            <span className="text-blue-200">
              <Target size={14} className="inline mr-1" />
              {project.totalTasks} total
            </span>
          </div>
        </div>

        {/* Upcoming Milestones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4">Upcoming Milestones</h3>

          <div className="space-y-3">
            {milestones && milestones.length > 0 ? (
              milestones
                .filter(m => m.status !== 'Completed')
                .slice(0, 5)
                .map((milestone) => (
                  <div
                    key={milestone._id}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      milestone.status === 'In Progress'
                        ? 'bg-blue-50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      milestone.status === 'In Progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-gray-900">
                        {milestone.title}
                      </p>
                      {milestone.dueDate && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(milestone.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-gray-500 py-4">No upcoming milestones</p>
            )}
          </div>
        </div>

        {/* Quick Task List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Quick Tasks</h3>
            <button className="text-blue-600 hover:text-blue-700">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {quickTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                  <p className="text-xs text-gray-500">{task.assignee}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Team Members</h3>
            <span className="text-sm text-gray-500">{project.members.length} members</span>
          </div>

          <div className="flex -space-x-3">
            {project.members.slice(0, 5).map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                title={member.name}
                className="w-10 h-10 rounded-full border-2 border-white hover:z-10 hover:scale-110 transition-transform cursor-pointer"
              />
            ))}
            {project.members.length > 5 && (
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-sm font-medium text-gray-600">
                +{project.members.length - 5}
              </div>
            )}
          </div>

          <button className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Plus size={16} />
            Invite Member
          </button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
