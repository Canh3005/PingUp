/**
 * Example Component: ProjectHubHeader
 * 
 * This component demonstrates how to use the permission system
 * to conditionally render UI elements based on user roles.
 */

import React from 'react';
import { Settings, Trash2, Users, Briefcase } from 'lucide-react';
import useProjectHubPermissions from '../../hooks/useProjectHubPermissions';

const ProjectHubHeader = ({ project, onOpenSettings, onOpenMembers, onDelete }) => {
  // Get all permissions for current user
  const {
    role,
    isOwner,
    canUpdateHubSettings,
    canDeleteHub,
    canManageMembers,
  } = useProjectHubPermissions(project);

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Hub Info */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {project.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Your role: <span className="font-medium capitalize">{role}</span>
          </p>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Team Management - Owner/Admin only */}
          {canManageMembers && (
            <button
              onClick={onOpenMembers}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Users size={18} />
              Manage Team
            </button>
          )}

          {/* Settings - Owner/Admin only */}
          {canUpdateHubSettings && (
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Settings size={18} />
              Settings
            </button>
          )}

          {/* Delete - Owner only */}
          {canDeleteHub && (
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              {isOwner ? 'Delete Hub' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Owner Badge */}
      {isOwner && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium rounded-full border border-yellow-200">
          <Briefcase size={12} />
          You are the owner of this hub
        </div>
      )}
    </div>
  );
};

export default ProjectHubHeader;
