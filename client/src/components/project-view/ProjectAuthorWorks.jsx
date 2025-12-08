import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ThumbsUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import projectApi from '../../api/projectApi';

const ProjectAuthorWorks = ({ project }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [authorProjects, setAuthorProjects] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorProjects = async () => {
      if (project?.owner?._id) {
        try {
          setIsLoading(true);
          const response = await projectApi.getUserPublishedProjects(
            project.owner._id,
            6,
            project._id // Exclude current project
          );
          if (response.success) {
            setAuthorProjects(response.projects);
            // Check if we need to show arrows
            setTimeout(() => checkScrollPosition(), 100);
          }
        } catch (error) {
          console.error('Error fetching author projects:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAuthorProjects();
  }, [project]);

  const checkScrollPosition = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  if (authorProjects.length === 0 && !isLoading) {
    return null; // Don't show section if author has no other projects
  }

  return (
    <div className="bg-neutral-900 text-white py-8 max-w-7xl mx-auto px-4">
      <div className="w-full px-6">
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={project.owner?.profile?.avatarUrl || project.owner?.imageUrl || 'https://via.placeholder.com/80'}
            alt={project.owner?.profile?.name || project.owner?.userName || 'User'}
            className="w-15 h-15 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-bold">
              {project.owner?.profile?.name || project.owner?.userName || 'Unknown User'}
            </h3>
            {project.owner?.profile?.jobTitle && (
              <p className="text-gray-400 text-sm">{project.owner.profile.jobTitle}</p>
            )}
          </div>
        </div>

        {/* More Works Section */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Loading more works...</p>
          </div>
        ) : authorProjects.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xl font-semibold mb-4">More by {project.owner?.profile?.name || project.owner?.userName}</h4>
            
            {/* Horizontal scroll container for projects */}
            <div className="relative">
              {showLeftArrow && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-3/7 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 -ml-5"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
              )}
              
              <div
                ref={scrollContainerRef}
                onScroll={checkScrollPosition}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {authorProjects.map((authorProject) => (
                  <div
                    key={authorProject._id}
                    className="flex-shrink-0 w-80 cursor-pointer group"
                    onClick={() => handleProjectClick(authorProject._id)}
                  >
                    <div className="bg-gray-800 rounded-lg overflow-hidden relative">
                      <img
                        src={authorProject.coverImage || 'https://via.placeholder.com/320x240?text=No+Cover'}
                        alt={authorProject.title}
                        className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-white">
                          <ThumbsUp className="w-5 h-5" />
                          <span className="font-medium">{authorProject.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white">
                          <Eye className="w-5 h-5" />
                          <span className="font-medium">{authorProject.views || 0}</span>
                        </div>
                      </div>
                    </div>
                    <h5 className="text-white font-semibold mt-2 group-hover:text-blue-400 transition-colors">
                      {authorProject.title}
                    </h5>
                  </div>
                ))}
              </div>

              {showRightArrow && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-3/7 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 -mr-5"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectAuthorWorks;
