import React from 'react';

const ProfileCover = ({ coverImage }) => {
  return (
    <div 
      className="w-full h-70 bg-gradient-to-r from-gray-300 to-gray-400 bg-cover bg-center"
      style={coverImage ? { backgroundImage: `url(${coverImage})` } : {}}
    ></div>
  );
};

export default ProfileCover;
