import React from 'react';
import { Image, ExternalLink } from 'lucide-react';

const PortfolioSection = ({ portfolioItems, isOwnProfile }) => {
  if ((!portfolioItems || portfolioItems.length === 0) && !isOwnProfile) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
          <Image className="w-5 h-5 text-pink-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {portfolioItems.map((item) => (
          <div key={item.id} className="group cursor-pointer">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-2 relative shadow-sm group-hover:shadow-lg transition-all">
              <img
                src={item.image}
                alt={item.tag}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="text-white text-xs font-medium px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg">{item.tag}</span>
                <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/40 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSection;
