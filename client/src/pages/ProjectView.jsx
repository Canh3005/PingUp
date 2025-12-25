import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronUp } from 'lucide-react';
import projectApi from '../api/projectApi';
import followApi from '../api/followApi';
import ProjectHeader from '../components/project-view/ProjectHeader';
import ProjectSidebar from '../components/project-view/ProjectSidebar';
import ProjectContent from '../components/project-view/ProjectContent';
import ProjectFooter from '../components/project-view/ProjectFooter';
import ProjectAuthorWorks from '../components/project-view/ProjectAuthorWorks';
import ProjectComments from '../components/project-view/ProjectComments';
import Loading from '../components/Loading';
import { useAuth } from '../context/authContext';

const ProjectView = ({ projectId, onClose, onProjectClick }) => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const isOwnProject = user?._id === project?.owner?._id;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await projectApi.getProject(projectId);
        setProject(response.data);

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

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [projectId]);

  // Check follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user && project?.owner?._id && !isOwnProject) {
        try {
          const response = await followApi.checkFollowStatus(project.owner._id);
          if (response.success) {
            setIsFollowing(response.data.isFollowing);
          }
        } catch (error) {
          console.error('Error checking follow status:', error);
        }
      }
    };
    checkFollowStatus();
  }, [user, project?.owner?._id, isOwnProject]);

  const handleScroll = (e) => {
    setShowScrollTop(e.target.scrollTop > 500);
  };

  const scrollToTop = () => {
    document.querySelector('.project-view-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToComments = () => {
    const commentsSection = document.getElementById('project-comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLike = async () => {
    try {
      const response = await projectApi.toggleLike(projectId);

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

  const handleFollowToggle = async () => {
    if (isFollowLoading || !user) return;
    
    try {
      setIsFollowLoading(true);
      if (isFollowing) {
        const response = await followApi.unfollowUser(project.owner._id);
        if (response.success) {
          setIsFollowing(false);
        }
      } else {
        const response = await followApi.followUser(project.owner._id);
        if (response.success) {
          setIsFollowing(true);
        }
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm overflow-y-auto project-view-scroll"
      onClick={handleBackdropClick}
      onScroll={handleScroll}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-6 z-50 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl transition-all hover:scale-110 group cursor-pointer border border-white/10"
        aria-label="Close"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Scroll to Top Button - rendered via portal to stay fixed on viewport */}
      {showScrollTop && createPortal(
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[60] p-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>,
        document.body
      )}

      {/* Content Container */}
      <div className="relative min-h-screen">
        {isLoading ? (
          <Loading dark={true} height="100vh" />
        ) : error ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-white text-lg font-medium">{error}</p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-black/40 to-black/60" onClick={(e) => e.stopPropagation()}>
            <ProjectHeader project={project} isOwnProject={isOwnProject} />
            <ProjectSidebar 
              project={project} 
              onLike={handleLike} 
              isOwnProject={isOwnProject}
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              onFollowToggle={handleFollowToggle}
              onCommentClick={scrollToComments}
            />

            <div className="max-w-7xl mx-auto">
              <ProjectContent project={project}/>
            </div>

            <ProjectFooter project={project} onLike={handleLike} isOwnProject={isOwnProject} />
            <ProjectAuthorWorks 
              project={project} 
              isOwnProject={isOwnProject}
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              onFollowToggle={handleFollowToggle}
              onProjectClick={onProjectClick}
            />
            <ProjectComments 
              project={project} 
              projectId={projectId} 
              isOwnProject={isOwnProject}
              isFollowing={isFollowing}
              isFollowLoading={isFollowLoading}
              onFollowToggle={handleFollowToggle}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectView;
