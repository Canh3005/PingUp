import React from 'react';

const HireBanner = () => {
  return (
    <div className="mb-8 relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 text-white p-16 text-center min-h-[280px] flex items-center justify-center">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200" 
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-3">
          Connect with <span className="text-blue-400">Amazing Creators</span>
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto">
          Whether you're looking to <strong>hire talented professionals</strong> or <strong>find collaborators</strong> for your next project, 
          connect with over 1 million creatives ready to bring your ideas to life.
        </p>
      </div>
    </div>
  );
};

export default HireBanner;


