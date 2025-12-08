import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Cloud } from 'lucide-react';

const FeedHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects');

  return (
    <div className="sticky top-13 z-30 bg-white -mt-13">
      <div className="w-full px-6 py-4 pt-6">
        <div className="flex items-center gap-4">
          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filter</span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Pingup..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border-0 rounded-full focus:outline-none ring-1 ring-gray-300 focus:bg-white"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 ml-auto">
            <button 
              onClick={() => setActiveTab('projects')}
              className={`text-sm font-semibold pb-1 transition-colors cursor-pointer ${
                activeTab === 'projects' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Projects
            </button>
            <button 
              onClick={() => setActiveTab('people')}
              className={`text-sm font-semibold pb-1 transition-colors cursor-pointer ${
                activeTab === 'people' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-700'
              }`}
            >
              People
            </button>
            <button 
              onClick={() => setActiveTab('assets')}
              className={`text-sm font-semibold pb-1 transition-colors cursor-pointer ${
                activeTab === 'assets' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-700'
              }`}
            >
              Assets
            </button>
            <button 
              onClick={() => setActiveTab('images')}
              className={`text-sm font-semibold pb-1 transition-colors cursor-pointer ${
                activeTab === 'images' 
                  ? 'text-gray-900 border-b-2 border-gray-900' 
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-700'
              }`}
            >
              Images
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 ml-6">
            <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
              <Cloud className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Recommended</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
