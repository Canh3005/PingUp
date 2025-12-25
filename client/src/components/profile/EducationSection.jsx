import React from 'react';
import { GraduationCap, Plus } from 'lucide-react';

const EducationSection = ({ education = [], onAddEducation, onEditEducation, isOwnProfile }) => {
  // Hide if no education and not own profile
  if ((!education || education.length === 0) && !isOwnProfile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Education</h2>
        </div>
        {isOwnProfile && (<button
          onClick={() => onAddEducation()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all border border-blue-200 hover:border-blue-600"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
        )}
      </div>

      {education.length > 0 ? (
        <div className="space-y-3">
          {education.map((edu, index) => (
            <div
              key={index}
              className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group"
              onClick={() => onEditEducation(edu)}
            >
              <div className="flex-shrink-0 w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">{edu.school}</h3>
                <p className="text-gray-600 text-sm truncate">{edu.degree}, {edu.fieldOfStudy}</p>
                <p className="text-gray-400 text-xs mt-0.5">{edu.startYear} - {edu.endYear}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-xl">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <GraduationCap className="w-7 h-7 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium text-sm">No education added</p>
          <p className="text-xs text-gray-400 mt-1">Show your qualifications to stand out</p>
        </div>
      )}
    </div>
  );
};

export default EducationSection;