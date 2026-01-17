import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronUp, AlertTriangle } from 'lucide-react';
import projectApi from '../api/projectApi';
import projectHubApi from '../api/projectHubApi';
import followApi from '../api/followApi';
import ProjectHeader from '../components/project-view/ProjectHeader';
import ProjectSidebar from '../components/project-view/ProjectSidebar';
import ProjectContent from '../components/project-view/ProjectContent';
import ProjectHubInfo from '../components/project-view/ProjectHubInfo';
import ProjectRecruitment from '../components/project-view/ProjectRecruitment';
import ProjectFooter from '../components/project-view/ProjectFooter';
import ProjectAuthorWorks from '../components/project-view/ProjectAuthorWorks';
import ProjectComments from '../components/project-view/ProjectComments';
import Loading from '../components/Loading';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';

const ProjectView = ({ projectId, onClose, onProjectClick }) => {
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    if (!user?._id) return;
    
    try {
      const response = await projectApi.toggleLike(projectId);

      setProject(prev => ({
        ...prev,
        likes: response.data.isLiked
          ? [...prev.likes, user._id]
          : prev.likes.filter(id => id !== user._id),
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

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      
      // Delete project
      await projectApi.deleteProject(projectId);
      
      // If project has ProjectHub, delete it too
      if (project.projectHubId) {
        await projectHubApi.deleteProjectHub(project.projectHubId._id);
      }
      
      toast.success('Project deleted successfully!');
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
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
            <ProjectHeader project={project} isOwnProject={isOwnProject} onDelete={handleDeleteClick} user={user} />
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

            {/* Project Hub Info */}
            {project.projectHubId && project.projectHubId.visibility && (
              <div className="max-w-7xl mx-auto">
                <ProjectHubInfo hubData={project.projectHubId} />
              </div>
            )}

            <div className="max-w-7xl mx-auto">
              <ProjectRecruitment project={project} />
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && createPortal(
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Project?</h3>
                <p className="text-gray-600 text-sm mb-3">
                  This action cannot be undone. This will permanently delete your project and all of its content.
                </p>
                {project?.projectHubId && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-3">
                    <p className="text-orange-800 text-sm font-medium">
                      ⚠️ This project has a Project Hub that will also be deleted.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectView;
