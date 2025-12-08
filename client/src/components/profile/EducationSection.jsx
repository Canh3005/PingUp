import React from 'react';
import { GraduationCap, Plus } from 'lucide-react';

const EducationSection = ({ education = [], onAddEducation, onEditEducation }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Education</h2>
        <button
          onClick={() => onAddEducation()}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add education
        </button>
      </div>

      {education.length > 0 ? (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div 
              key={index} 
              className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onEditEducation(edu)}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{edu.school}</h3>
                <p className="text-gray-600 text-sm">{edu.degree}, {edu.fieldOfStudy}</p>
                <p className="text-gray-500 text-xs">{edu.startYear} - {edu.endYear}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <GraduationCap className="w-10 h-10 mx-auto mb-2 text-gray-400" />
          <p className="text-xs">Show your qualifications and be up to 2X more likely to receive a recruiter InMail</p>
        </div>
      )}
    </div>
  );
};

export default EducationSection;