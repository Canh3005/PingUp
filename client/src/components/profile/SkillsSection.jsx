import React from 'react';
import { Sparkles } from 'lucide-react';

const SkillsSection = ({ skills }) => {
  const skillColors = [
    'bg-blue-50 text-blue-700 border-blue-100',
    'bg-purple-50 text-purple-700 border-purple-100',
    'bg-green-50 text-green-700 border-green-100',
    'bg-orange-50 text-orange-700 border-orange-100',
    'bg-pink-50 text-pink-700 border-pink-100',
    'bg-cyan-50 text-cyan-700 border-cyan-100',
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Skills</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-transform hover:scale-105 cursor-default ${skillColors[index % skillColors.length]}`}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
