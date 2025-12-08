import React from 'react';

const SkillsSection = ({ skills }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={index} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
