import React, { useState, useEffect } from 'react';
import { Heart, Eye, MessageCircle } from 'lucide-react';
import projectApi from '../../api/projectApi';

const ProjectCard = ({ project, onClick }) => {
  const handleClick = () => {
    onClick(project._id);
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      {/* Project Image */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
        <img
          src={project.coverImage || 'https://via.placeholder.com/600x400?text=No+Cover+Image'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm">{project.likes?.length >= 1000 ? `${(project.likes.length / 1000).toFixed(1)}K` : project.likes?.length || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{project.views >= 1000 ? `${(project.views / 1000).toFixed(1)}K` : project.views || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-gray-600 truncate mt-1">{project.owner?.userName || 'Anonymous'}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" />
            <span>{project.likes?.length >= 1000 ? `${(project.likes.length / 1000).toFixed(1)}K` : project.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{project.views >= 1000 ? `${(project.views / 1000).toFixed(1)}K` : project.views || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectGrid = ({ onProjectClick }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await projectApi.getPublishedProjects(page, 20);
      
      if (response.success) {
        setProjects(response.data || []);
        setHasMore(response.pagination?.page < response.pagination?.pages);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    try {
      const nextPage = page + 1;
      const response = await projectApi.getPublishedProjects(nextPage, 20);
      
      if (response.success) {
        setProjects([...projects, ...(response.data || [])]);
        setPage(nextPage);
        setHasMore(response.pagination?.page < response.pagination?.pages);
      }
    } catch (error) {
      console.error('Error loading more projects:', error);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen py-4 mt-6">
        <div className="w-full px-6">
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-4 mt-6">
      <div className="w-full px-6">
        {/* Personalize Feed Button */}
        <div className="flex justify-start mb-4">
          <div className="flex items-center gap-2 text-sm text-black">
            <span className="font-medium">Recommended for you</span>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-gray-500">No projects found</div>
          </div>
        ) : (
          <>
            {/* Project Grid - 5 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} onClick={onProjectClick} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="flex justify-center mt-12">
                <button 
                  onClick={loadMore}
                  className="px-8 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 cursor-pointer"
                >
                  Load More Projects
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectGrid;
