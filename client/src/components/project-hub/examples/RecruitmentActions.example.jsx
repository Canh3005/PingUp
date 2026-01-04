/**
 * Example Component: RecruitmentActions
 * 
 * Demonstrates permission-based actions for recruitment management
 */

import React from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import useProjectHubPermissions from '../../hooks/useProjectHubPermissions';

const RecruitmentActions = ({ project, recruitment, onEdit, onDelete, onReviewApplication }) => {
  const {
    canCreateRecruitment,
    canUpdateRecruitment,
    canDeleteRecruitment,
    canReviewApplication,
    isAdminOrOwner,
  } = useProjectHubPermissions(project);

  return (
    <div className="space-y-4">
      {/* Create Recruitment Button - Admin/Owner only */}
      {canCreateRecruitment && (
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus size={18} />
          Create New Recruitment Post
        </button>
      )}

      {/* Recruitment Card with Actions */}
      {recruitment && (
        <div className="border border-gray-200 rounded-lg p-4">
          {/* Recruitment Info */}
          <div className="mb-3">
            <h3 className="font-semibold text-gray-900">{recruitment.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{recruitment.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{recruitment.applications?.length || 0} applications</span>
              <span>Posted {new Date(recruitment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Action Buttons - Admin/Owner only */}
          {isAdminOrOwner && (
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              {/* Edit */}
              {canUpdateRecruitment && (
                <button
                  onClick={() => onEdit(recruitment)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
              )}

              {/* Delete */}
              {canDeleteRecruitment && (
                <button
                  onClick={() => onDelete(recruitment)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
            </div>
          )}

          {/* Application Review - Admin/Owner only */}
          {canReviewApplication && recruitment.applications?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Pending Applications ({recruitment.applications.length})
              </h4>
              <div className="space-y-2">
                {recruitment.applications.slice(0, 3).map((app) => (
                  <div
                    key={app._id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={app.user?.avatarUrl || `https://ui-avatars.com/api/?name=${app.user?.name}`}
                        alt={app.user?.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {app.user?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app.status || 'pending'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onReviewApplication(app._id, 'approved')}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Accept"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => onReviewApplication(app._id, 'rejected')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Reject"
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruitmentActions;
