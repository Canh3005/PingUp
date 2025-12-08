import React, { useRef, useState, useEffect } from 'react';
import { Heart, Eye, ChevronLeft, ChevronRight, Plus, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectsSection = ({ projects = [] }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    checkScrollPosition();
  }, [projects]);

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleCreateProject = () => {
    navigate('/create-project');
  };

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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        </div>
        <button
          onClick={handleCreateProject}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Create new</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No projects yet</p>
          <p className="text-sm text-gray-400 mt-1">Create your first project to showcase your work</p>
        </div>
      ) : (
        <div className="relative">
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all -ml-5"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}

          {/* Projects Container */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {projects.map((project) => (
              <div
                key={project._id}
                className="flex-shrink-0 w-72 cursor-pointer group"
                onClick={() => handleProjectClick(project._id)}
              >
                <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-3 relative shadow-sm group-hover:shadow-lg transition-all">
                  <img
                    src={project.coverImage || 'https://via.placeholder.com/400x300?text=No+Cover+Image'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                  {/* Stats on hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-4 text-white">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">{project.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">{project.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-gray-500 text-sm line-clamp-2">{project.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all -mr-5"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
