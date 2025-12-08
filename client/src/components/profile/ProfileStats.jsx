import React from 'react';
import { Briefcase, Calendar } from 'lucide-react';

const ProfileStats = ({ profileData }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      {/* Showcase Availability */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Showcase Your Availability</h3>
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Freelance/Project</p>
              <p className="text-xs text-gray-600">Availability: Now</p>
            </div>
          </div>
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Edit Availability
        </button>
      </div>

      {/* Project Views */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Project Views</span>
          <span className="text-2xl font-bold text-gray-900">{profileData?.projectViews || 3}</span>
        </div>
      </div>

      {/* Work Experience */}
      {profileData?.experiences && profileData.experiences.length > 0 && (
        <div className="border-t border-gray-200 mt-6 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4 uppercase text-xs tracking-wide text-gray-600">
            WORK EXPERIENCE
          </h3>
          {profileData.experiences.slice(0, 2).map((exp, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="font-medium text-gray-900">{exp.position}</p>
              <p className="text-sm text-gray-600">{exp.company}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Calendar className="w-3 h-3" />
                <span>{exp.startDate} - {exp.endDate || 'Present'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileStats;
