/**
 * Example Component: ContentActions
 * 
 * Demonstrates permission-based CRUD actions for content (Milestones, Tasks, Devlogs)
 */

import React from 'react';
import { Plus, Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import useProjectHubPermissions from '../../hooks/useProjectHubPermissions';

const ContentActions = ({ project, contentType = 'milestone' }) => {
  const {
    role,
    // Milestone permissions
    canCreateMilestone,
    canUpdateMilestone,
    canDeleteMilestone,
    // Task permissions
    canCreateTask,
    canUpdateTask,
    canDeleteTask,
    // Devlog permissions
    canCreateDevlog,
    canUpdateDevlog,
    canDeleteDevlog,
    // Role checks
    isMemberOrAbove,
    isAdminOrOwner,
  } = useProjectHubPermissions(project);

  // Get permissions based on content type
  const permissions = {
    milestone: {
      canCreate: canCreateMilestone,
      canUpdate: canUpdateMilestone,
      canDelete: canDeleteMilestone,
    },
    task: {
      canCreate: canCreateTask,
      canUpdate: canUpdateTask,
      canDelete: canDeleteTask,
    },
    devlog: {
      canCreate: canCreateDevlog,
      canUpdate: canUpdateDevlog,
      canDelete: canDeleteDevlog,
    },
  }[contentType];

  const contentLabels = {
    milestone: 'Milestone',
    task: 'Task',
    devlog: 'Dev Log',
  };

  return (
    <div className="space-y-4">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {contentLabels[contentType]}s
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {permissions.canCreate
              ? 'You can create and edit content'
              : permissions.canUpdate
              ? 'You can edit existing content'
              : 'View-only access'}
          </p>
        </div>

        {/* Create Button - Members and above */}
        {permissions.canCreate && (
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            <Plus size={18} />
            Create {contentLabels[contentType]}
          </button>
        )}
      </div>

      {/* Example Content Card */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              Example {contentLabels[contentType]}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              This is a sample {contentType} description
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-gray-500">
                Created by John Doe
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
          </div>

          {/* Actions Dropdown - Show if user can edit or delete */}
          {(permissions.canUpdate || permissions.canDelete) && (
            <div className="relative">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {(permissions.canUpdate || permissions.canDelete) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            {/* Edit - Members and above */}
            {permissions.canUpdate && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Edit2 size={14} />
                Edit
              </button>
            )}

            {/* Delete - Owner/Admin only */}
            {permissions.canDelete && (
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                <Trash2 size={14} />
                Delete
              </button>
            )}

            {/* Role-based info badge */}
            <div className="ml-auto">
              {isAdminOrOwner ? (
                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                  Full Control
                </span>
              ) : isMemberOrAbove ? (
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Can Edit
                </span>
              ) : (
                <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                  View Only
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Permission Summary Panel */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Your Permissions as <span className="capitalize">{role}</span>
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                permissions.canCreate ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-xs text-gray-700">Create</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                permissions.canUpdate ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-xs text-gray-700">Update</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                permissions.canDelete ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="text-xs text-gray-700">Delete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentActions;
