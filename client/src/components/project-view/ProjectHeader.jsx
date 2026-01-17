import React from 'react';
import { Edit3, ExternalLink, LayoutDashboard, Trash2, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectHeader = ({ project, isOwnProject, onDelete, user }) => {
  const navigate = useNavigate();
  const hasProjectHub = !!project.projectHubId;
  
  // Check if user is owner or member of the Project Hub
  const canViewProjectHub = hasProjectHub && user && (() => {
    const hub = project.projectHubId;
    
    // Check if user is owner of the project (which means owner of hub)
    if (isOwnProject) return true;
    
    // Check if user is a member of the Project Hub
    if (hub?.members && Array.isArray(hub.members)) {
      return hub.members.some(member => 
        member.user?._id === user.profile._id || member.user === user.profile._id
      );
    }
    
    return false;
  })();

  // Check if user can request to join (not owner, not member, has hub, logged in)
  const canRequestToJoin = hasProjectHub && user && !canViewProjectHub;

  const handleOpenHub = () => {
    // projectHubId is populated, so we need to get the _id
    const hubId = project.projectHubId?._id || project.projectHubId;
    navigate(`/project-hub/${hubId}`);
  };
  const handleCreateHub = () => {
      navigate(`/project-hub/create`, { state: { projectId: project._id } });
  };

  const handleRequestJoin = () => {
    // TODO: Implement request to join functionality
    console.log('Request to join Project Hub');
    // This will open a modal or send a request to the project owner
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-lg"></div>
            <img
              src={project.owner?.profile?.avatarUrl || project.owner?.imageUrl || 'https://via.placeholder.com/40'}
              alt={project.owner?.profile?.name || 'User'}
              className="relative w-14 h-14 rounded-2xl object-cover ring-2 ring-white/20"
            />
          </div>

          {/* Project Info */}
          <div>
            <h2 className="font-bold text-white text-2xl tracking-tight">{project.title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-white/80 font-medium hover:text-white transition-colors cursor-pointer">
                {project.owner?.profile?.name || project.owner?.userName || 'Unknown'}
              </span>
              {project.owner?.profile?.jobTitle && (
                <>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60 text-sm">{project.owner.profile.jobTitle}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Project Hub Button - Only show if user is owner or member */}
          {canViewProjectHub && (
            <button
              onClick={handleOpenHub}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all shadow-lg shadow-blue-600/25"
            >
              <LayoutDashboard className="w-4 h-4" />
              Project Hub
            </button>
          )}
          {
            !hasProjectHub && isOwnProject && (
              <button
                onClick={handleCreateHub}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all shadow-lg shadow-green-600/25"
              >
                <LayoutDashboard className="w-4 h-4" />
                Create Project Hub
              </button>
            )
          }

          {/* Request to Join Button - Show if user is not member/owner but hub exists */}
          {canRequestToJoin && (
            <button
              onClick={handleRequestJoin}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all shadow-lg shadow-purple-600/25"
            >
              <UserPlus className="w-4 h-4" />
              Request to Join
            </button>
          )}

          {isOwnProject && (
            <>
              <button 
                onClick={() => navigate(`/edit-project/${project._id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all border border-white/10 hover:border-white/20"
              >
                <Edit3 className="w-4 h-4" />
                Edit Project
              </button>
              <button 
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-700 backdrop-blur-sm rounded-xl text-white text-sm font-medium transition-all border border-red-500/30 hover:border-red-500/50 shadow-lg shadow-red-600/25"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          )}
          <button className="p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all border border-white/10 hover:border-white/20">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
