import React from 'react';

const AboutSection = ({ bio }) => {
  if (!bio) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
      <p className="text-gray-700 leading-relaxed">{bio}</p>
    </div>
  );
};

export default AboutSection;
