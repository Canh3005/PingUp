import React from 'react';
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
  Plus
} from 'lucide-react';

const OverviewTab = ({ project }) => {
  // Mock data for devlogs
  const recentDevlogs = [
    {
      id: 1,
      title: 'Implemented new particle system',
      author: { name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop' },
      excerpt: 'Added a stunning particle system for space dust and nebula effects. Performance optimized for mobile devices.',
      thumbnail: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=200&fit=crop',
      date: '2 hours ago',
      reactions: 12,
      comments: 5
    },
    {
      id: 2,
      title: 'UI/UX overhaul for main menu',
      author: { name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop' },
      excerpt: 'Redesigned the main menu with a cleaner, more intuitive layout. Added smooth transitions and hover effects.',
      thumbnail: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=200&fit=crop',
      date: '1 day ago',
      reactions: 24,
      comments: 8
    },
    {
      id: 3,
      title: 'Sound design progress update',
      author: { name: 'Emily Wang', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop' },
      excerpt: 'Finished composing ambient tracks for the exploration segments. Working on combat sound effects next.',
      thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=200&fit=crop',
      date: '2 days ago',
      reactions: 18,
      comments: 3
    }
  ];

  // Mock data for recent activity
  const recentActivity = [
    { id: 1, user: 'Alex Chen', action: 'completed task', target: 'Implement save system', time: '30 min ago' },
    { id: 2, user: 'Sarah Kim', action: 'uploaded file', target: 'menu_mockup_v3.fig', time: '1 hour ago' },
    { id: 3, user: 'Mike Johnson', action: 'commented on', target: 'Physics bug fix', time: '2 hours ago' },
    { id: 4, user: 'Emily Wang', action: 'created task', target: 'Add footstep sounds', time: '3 hours ago' },
    { id: 5, user: 'Alex Chen', action: 'moved task to Done', target: 'Level 3 design', time: '5 hours ago' },
  ];

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
            {recentDevlogs.map((devlog) => (
              <div
                key={devlog.id}
                className="group flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <img
                  src={devlog.thumbnail}
                  alt={devlog.title}
                  className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {devlog.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{devlog.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={devlog.author.avatar}
                        alt={devlog.author.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-xs text-gray-500">{devlog.author.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{devlog.date}</span>
                    <div className="flex items-center gap-3 ml-auto">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Heart size={12} /> {devlog.reactions}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageSquare size={12} /> {devlog.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center justify-center gap-2">
            View All Devlogs <ArrowRight size={16} />
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>

          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-gray-600 flex-1">
                  <span className="font-medium text-gray-900">{activity.user}</span>
                  {' '}{activity.action}{' '}
                  <span className="font-medium text-blue-600">{activity.target}</span>
                </p>
                <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
              </div>
            ))}
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
            {project.milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  milestone.status === 'completed'
                    ? 'bg-green-50'
                    : milestone.status === 'in_progress'
                    ? 'bg-blue-50'
                    : 'bg-gray-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  milestone.status === 'completed'
                    ? 'bg-green-500'
                    : milestone.status === 'in_progress'
                    ? 'bg-blue-500'
                    : 'bg-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${
                    milestone.status === 'completed' ? 'text-green-700' : 'text-gray-900'
                  }`}>
                    {milestone.title}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(milestone.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                {milestone.status === 'completed' && (
                  <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                )}
              </div>
            ))}
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
