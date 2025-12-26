import React from 'react';
import { User } from 'lucide-react';

const AboutSection = ({ bio }) => {
  // Hide if no bio and not own profile
  if (!bio) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">About</h2>
      </div>
      <p className="text-gray-600 leading-relaxed">{bio}</p>
    </div>
  );
};

export default AboutSection;
