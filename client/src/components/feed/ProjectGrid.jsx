import React, { useState, useEffect, useRef } from 'react';
import { Heart, Eye, Bookmark, Play } from 'lucide-react';
import projectApi from '../../api/projectApi';

const ProjectCard = ({ project, onClick }) => {
  const handleClick = () => {
    onClick(project._id);
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count || 0;
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      {/* Project Image */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-3 shadow-sm hover:shadow-xl transition-all duration-300">
        <img
          src={project.coverImage || 'https://via.placeholder.com/600x400?text=No+Cover+Image'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-xl hover:bg-white hover:scale-110 transition-all shadow-lg"
          >
            <Bookmark className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        {/* Bottom Stats */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{formatCount(project.likes?.length)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{formatCount(project.views)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="px-1">
        <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            {project.owner?.imageUrl && (
              <img
                src={project.owner.imageUrl}
                alt={project.owner?.userName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
              />
            )}
            <p className="text-xs text-gray-500 truncate">{project.owner?.userName || 'Anonymous'}</p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {formatCount(project.likes?.length)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatCount(project.views)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectGrid = ({ onProjectClick, filter, category }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  // Map filter to API parameters
  const getFilterParams = () => {
    const params = {};
    
    // Sort by filter
    if (filter === 'recent') {
      params.sortBy = 'createdAt';
      params.sortOrder = 'desc';
    } else if (filter === 'popular') {
      params.sortBy = 'likes';
      params.sortOrder = 'desc';
    } else if (filter === 'viewed') {
      params.sortBy = 'views';
      params.sortOrder = 'desc';
    }
    
    // Category filter - map category ID to display name
    if (category && category !== 'for-you' && category !== 'following' && category !== 'best') {
      // Map category IDs to proper names for backend
      const categoryMap = {
        'graphic-design': 'Graphic Design',
        'photography': 'Photography',
        'web-design': 'Web Design',
        'music': 'Music',
        'illustration': 'Illustration',
        '3d-art': '3D Art',
        'ui-ux': 'UI/UX',
        'motion': 'Motion',
        'architecture': 'Architecture',
        'product-design': 'Product Design',
        'fashion': 'Fashion',
        'advertising': 'Advertising'
      };
      
      params.category = categoryMap[category] || category;
    }
    
    return params;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Refetch when filter or category changes
  useEffect(() => {
    fetchProjects();
  }, [filter, category]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoadingMore, isLoading, page]);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const filterParams = getFilterParams();
      
      let response;
      if (category === 'following') {
        // Fetch projects from followed users
        response = await projectApi.getFollowingProjects(
          1,
          15,
          filterParams.sortBy || 'createdAt',
          filterParams.sortOrder || 'desc'
        );
      } else {
        // Fetch regular published projects
        response = await projectApi.getPublishedProjects(1, 15, filterParams);
      }
      
      if (response.success) {
        setProjects(response.data || []);
        setHasMore(response.pagination?.page < response.pagination?.pages);
        setPage(1);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    
    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const filterParams = getFilterParams();
      
      let response;
      if (category === 'following') {
        // Load more from followed users
        response = await projectApi.getFollowingProjects(
          nextPage,
          15,
          filterParams.sortBy || 'createdAt',
          filterParams.sortOrder || 'desc'
        );
      } else {
        // Load more regular published projects
        response = await projectApi.getPublishedProjects(nextPage, 15, filterParams);
      }
      
      if (response.success) {
        setProjects([...projects, ...(response.data || [])]);
        setPage(nextPage);
        setHasMore(response.pagination?.page < response.pagination?.pages);
      }
    } catch (error) {
      console.error('Error loading more projects:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="w-full px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="animate-pulse">
              {/* Image skeleton */}
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-3"></div>
              {/* Title skeleton */}
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              {/* Info skeleton */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="w-full px-6">
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No projects found</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new content</p>
          </div>
        ) : (
          <>
            {/* Project Grid - 5 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} onClick={onProjectClick} />
              ))}
            </div>

            {/* Infinite Scroll Observer Target */}
            <div ref={observerTarget} className="h-20 flex items-center justify-center mt-8">
              {isLoadingMore && (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-500 text-sm">Loading more projects...</p>
                </div>
              )}
              {!hasMore && projects.length > 0 && (
                <p className="text-gray-400 text-sm">You've reached the end! 🎉</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectGrid;
