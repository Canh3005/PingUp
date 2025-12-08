import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

const ExperienceSection = ({ experiences = [], onAddExperience, onEditExperience }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Experience</h2>
        <button
          onClick={() => onAddExperience()}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add experience
        </button>
      </div>

      {experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <div 
              key={index} 
              className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onEditExperience(exp)}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{exp.jobTitle}</h3>
                <p className="text-gray-600 text-sm">{exp.organization}</p>
                <p className="text-gray-500 text-sm">{exp.startYear} - {exp.endYear || 'present'}</p>
                {exp.description && (
                  <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Showcase your accomplishments and get up to 2X as many profile views and connections</p>
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;