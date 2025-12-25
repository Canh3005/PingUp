import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';

const FeedHeader = ({ selectedFilter, onFilterChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const filterOptions = [
    { id: 'recent', label: 'Most Recent', sortBy: 'createdAt' },
    { id: 'popular', label: 'Most Popular', sortBy: 'likes' },
    { id: 'viewed', label: 'Most Viewed', sortBy: 'views' },
  ];

  const handleFilterSelect = (filterId) => {
    onFilterChange(filterId);
    setShowFilterDropdown(false);
  };

  const tabs = [
    { id: 'projects', label: 'Projects' },
    { id: 'people', label: 'People' },
    { id: 'assets', label: 'Assets' },
    { id: 'images', label: 'Images' },
  ];

  return (
    <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="w-full px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter</span>
            </button>

            {showFilterDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowFilterDropdown(false)} />
                <div className="absolute left-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-20">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Filter by</p>
                  </div>
                  {filterOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleFilterSelect(option.id)}
                      className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                        selectedFilter === option.id
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, people, assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="hidden sm:inline">Recommended</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
