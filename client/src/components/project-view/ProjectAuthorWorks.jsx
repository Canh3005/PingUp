import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, Eye, UserPlus, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import projectApi from '../../api/projectApi';

const ProjectAuthorWorks = ({ project, isOwnProject }) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [authorProjects, setAuthorProjects] = useState([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthorProjects = async () => {
      if (project?.owner?._id) {
        try {
          setIsLoading(true);
          const response = await projectApi.getUserPublishedProjects(
            project.owner._id,
            6,
            project._id
          );
          if (response.success) {
            setAuthorProjects(response.projects);
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
    return null;
  }

  return (
    <div className="bg-gradient-to-b from-neutral-950 to-neutral-900 text-white py-12 max-w-7xl mx-auto">
      <div className="w-full px-6">
        {/* Author Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-10 border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg"></div>
                <img
                  src={project.owner?.profile?.avatarUrl || project.owner?.imageUrl || 'https://via.placeholder.com/80'}
                  alt={project.owner?.profile?.name || project.owner?.userName || 'User'}
                  className="relative w-16 h-16 rounded-2xl object-cover ring-2 ring-white/20"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {project.owner?.profile?.name || project.owner?.userName || 'Unknown User'}
                </h3>
                {project.owner?.profile?.jobTitle && (
                  <p className="text-white/60 text-sm mt-0.5">{project.owner.profile.jobTitle}</p>
                )}
                {project.owner?.profile?.location && (
                  <p className="text-white/40 text-xs mt-1">{project.owner.profile.location}</p>
                )}
              </div>
            </div>

            {!isOwnProject && (<div className="flex items-center gap-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  isFollowing
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
            )}
          </div>
        </div>

        {/* More Works Section */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/50">Loading more works...</p>
          </div>
        ) : authorProjects.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold">
                More by {project.owner?.profile?.name || project.owner?.userName}
              </h4>
              <span className="text-white/40 text-sm">{authorProjects.length} projects</span>
            </div>

            {/* Horizontal scroll container for projects */}
            <div className="relative">
              {showLeftArrow && (
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all -ml-5"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
              )}

              <div
                ref={scrollContainerRef}
                onScroll={checkScrollPosition}
                className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {authorProjects.map((authorProject) => (
                  <div
                    key={authorProject._id}
                    className="flex-shrink-0 w-80 cursor-pointer group"
                    onClick={() => handleProjectClick(authorProject._id)}
                  >
                    <div className="bg-white/5 rounded-2xl overflow-hidden relative border border-white/10 group-hover:border-white/20 transition-all">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={authorProject.coverImage || 'https://via.placeholder.com/320x240?text=No+Cover'}
                          alt={authorProject.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                        <div className="flex items-center gap-4 text-white">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4" />
                            <span className="text-sm font-medium">{authorProject.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-medium">{authorProject.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <h5 className="text-white font-semibold mt-3 group-hover:text-blue-400 transition-colors truncate">
                      {authorProject.title}
                    </h5>
                  </div>
                ))}
              </div>

              {showRightArrow && (
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all -mr-5"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
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
