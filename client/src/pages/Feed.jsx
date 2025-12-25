import React, { useState } from 'react';
import FeedHeader from '../components/feed/FeedHeader';
import FeedCategories from '../components/feed/FeedCategories';
import ProjectGrid from '../components/feed/ProjectGrid';
import PeopleGrid from '../components/feed/PeopleGrid';
import ProjectView from './ProjectView';

const Feed = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('recent');
  const [selectedCategory, setSelectedCategory] = useState('for-you');
  const [activeTab, setActiveTab] = useState('projects');

  const handleCloseProject = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 min-w-full">
      {/* Header with Filter + Search + Tabs */}
      <FeedHeader 
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Conditional rendering based on active tab */}
      {activeTab === 'projects' && (
        <>
          {/* Category Pills - For You, Following, etc. */}
          <FeedCategories 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          {/* Project Grid - 5 columns */}
          <ProjectGrid 
            onProjectClick={setSelectedProjectId}
            filter={selectedFilter}
            category={selectedCategory}
          />
        </>
      )}

      {activeTab === 'people' && (
        <PeopleGrid />
      )}

      {activeTab === 'assets' && (
        <div className="w-full px-6 py-12 text-center">
          <p className="text-gray-500">Assets view coming soon...</p>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="w-full px-6 py-12 text-center">
          <p className="text-gray-500">Images view coming soon...</p>
        </div>
      )}

      {/* Project View Modal */}
      {selectedProjectId && (
        <ProjectView 
          projectId={selectedProjectId} 
          onClose={handleCloseProject}
          onProjectClick={setSelectedProjectId}
        />
      )}
    </div>
  );
};

export default Feed;
