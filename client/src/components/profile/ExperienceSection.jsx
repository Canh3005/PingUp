import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

const ExperienceSection = ({ experiences = [], onAddExperience, onEditExperience, isOwnProfile }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Experience</h2>
        </div>
        {isOwnProfile && (<button
          onClick={() => onAddExperience()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all border border-blue-200 hover:border-blue-600"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
        )}
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-3">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group"
              onClick={() => onEditExperience(exp)}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <Briefcase className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{exp.jobTitle}</h3>
                <p className="text-gray-600 text-sm">{exp.organization}</p>
                <p className="text-gray-400 text-xs mt-1">{exp.startYear} - {exp.endYear || 'Present'}</p>
                {exp.description && (
                  <p className="text-gray-500 text-sm mt-2 line-clamp-2">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-xl">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Briefcase className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">No experience added</p>
          <p className="text-sm text-gray-400 mt-1">Showcase your accomplishments to stand out</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;