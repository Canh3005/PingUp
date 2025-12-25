import React, { useState } from 'react';
import FeedHeader from '../components/feed/FeedHeader';
import FeedCategories from '../components/feed/FeedCategories';
import ProjectGrid from '../components/feed/ProjectGrid';
import ProjectView from './ProjectView';

const Feed = () => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const handleCloseProject = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 min-w-full">
      {/* Header with Filter + Search + Recommended */}
      <FeedHeader />
      
      {/* Category Pills - For You, Following, etc. */}
      <FeedCategories />
      
      {/* Project Grid - 5 columns */}
      <ProjectGrid onProjectClick={setSelectedProjectId} />

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
