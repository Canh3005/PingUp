import React from 'react';
import { Activity, Clock, FolderOpen, Users, Heart } from 'lucide-react';

const ActivitySection = ({ activities, isOwnProfile }) => {
  if ((!activities || activities.length === 0) && !isOwnProfile) return null;

  const activityIcons = {
    project: FolderOpen,
    community: Users,
    follow: Heart,
  };

  const activityColors = {
    project: 'bg-green-50 text-green-600',
    community: 'bg-blue-50 text-blue-600',
    follow: 'bg-pink-50 text-pink-600',
  };

  const getActivityType = (index) => {
    const types = ['project', 'community', 'follow'];
    return types[index % types.length];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-cyan-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Activity</h2>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const type = getActivityType(index);
          const Icon = activityIcons[type];
          const colorClass = activityColors[type];

          return (
            <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all group cursor-pointer">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{activity}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">{index === 0 ? '2 hours ago' : index === 1 ? 'Yesterday' : '3 days ago'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySection;
