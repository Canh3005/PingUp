import React from 'react';

const ActivitySection = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Activity</h2>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivitySection;
