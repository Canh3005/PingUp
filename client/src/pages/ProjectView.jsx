import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import projectApi from '../api/projectApi';
import ProjectHeader from '../components/project-view/ProjectHeader';
import ProjectSidebar from '../components/project-view/ProjectSidebar';
import ProjectContent from '../components/project-view/ProjectContent';
import ProjectFooter from '../components/project-view/ProjectFooter';
import ProjectAuthorWorks from '../components/project-view/ProjectAuthorWorks';
import ProjectComments from '../components/project-view/ProjectComments';
import Loading from '../components/Loading';

const ProjectView = ({ projectId, onClose }) => {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await projectApi.getProject(projectId);
        console.log("Fetched project data:", response);
        setProject(response.data);
        
        // Increment view count
        await projectApi.incrementView(projectId);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }

    // Cleanup: restore body scroll
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [projectId]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle like toggle
  const handleLike = async () => {
    try {
      const response = await projectApi.toggleLike(projectId);
      
      // Update local state optimistically
      setProject(prev => ({
        ...prev,
        likes: response.data.isLiked 
          ? [...prev.likes, 'currentUser'] 
          : prev.likes.filter(id => id !== 'currentUser'),
        likesCount: response.data.likesCount,
      }));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors group cursor-pointer"
        aria-label="Close"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Content Container */}
      <div className="relative min-h-screen">
        {isLoading ? (
          <Loading dark={true} height="100vh" />
        ) : (
          <div className="bg-black/50" onClick={(e) => e.stopPropagation()}>
            <ProjectHeader project={project} />
            <ProjectSidebar project={project} onLike={handleLike} />
            
            <div className="max-w-7xl mx-auto">
              <ProjectContent project={project} />
            </div>

            <ProjectFooter project={project} onLike={handleLike} />
            <ProjectAuthorWorks project={project} />
            <ProjectComments project={project} projectId={projectId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
