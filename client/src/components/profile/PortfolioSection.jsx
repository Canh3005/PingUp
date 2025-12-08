import React from 'react';

const PortfolioSection = ({ portfolioItems }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
      <div className="grid grid-cols-3 gap-4">
        {portfolioItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-2">
              <img 
                src={item.image} 
                alt={item.tag}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <span className="text-sm text-gray-600">{item.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSection;
