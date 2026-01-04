import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Trash2 } from 'lucide-react';
import { 
  PROJECT_HUB_ROLES, 
  ROLE_LABELS, 
  ROLE_DESCRIPTIONS,
  getAssignableRoles,
  canUpdateMemberRole 
} from '../../../constants/projectHubRoles';
import RoleBadge from './RoleBadge';
import projectHubApi from '../../../api/projectHubApi';

const EditMemberModal = ({ 
  isOpen, 
  onClose, 
  member, 
  projectId, 
  currentUserRole,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    permissionRole: member?.permissionRole || PROJECT_HUB_ROLES.MEMBER,
    jobPosition: member?.jobPosition || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState('');

  // Update form data when member changes
  useEffect(() => {
    if (member) {
      setFormData({
        permissionRole: member.permissionRole || PROJECT_HUB_ROLES.MEMBER,
        jobPosition: member.jobPosition || '',
      });
      setError('');
    }
  }, [member]);

  const canEdit = canUpdateMemberRole(currentUserRole);
  const isOwner = member?.permissionRole === PROJECT_HUB_ROLES.OWNER;

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);
      await projectHubApi.updateMemberRole(projectId, member.user._id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Are you sure you want to remove ${member.user.name} from this project?`)) {
      return;
    }

    try {
      setIsRemoving(true);
      await projectHubApi.removeMember(projectId, member.user._id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setIsRemoving(false);
    }
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">Edit Team Member</h3>
            <p className="text-sm text-gray-500 mt-0.5">{member.user.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isOwner && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Owner role cannot be changed.</strong> Only one owner per project hub.
              </p>
            </div>
          )}

          {/* Permission Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permission Role
            </label>
            {isOwner ? (
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <RoleBadge role={PROJECT_HUB_ROLES.OWNER} size="lg" />
                <span className="text-sm text-gray-600">Cannot be changed</span>
              </div>
            ) : (
              <>
                <select
                  value={formData.permissionRole}
                  onChange={(e) => setFormData({ ...formData, permissionRole: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading || !canEdit}
                >
                  {getAssignableRoles().map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {ROLE_DESCRIPTIONS[formData.permissionRole]}
                </p>
              </>
            )}
          </div>

          {/* Job Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Position
            </label>
            <input
              type="text"
              value={formData.jobPosition}
              onChange={(e) => setFormData({ ...formData, jobPosition: e.target.value })}
              placeholder="e.g., Frontend Developer, UI Designer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || !canEdit}
            />
            <p className="text-xs text-gray-500 mt-1">
              The member's role in the project
            </p>
          </div>

          {/* Member Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900">{member.user.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Current Role</span>
                <RoleBadge role={member.permissionRole} />
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <div>
            {!isOwner && canEdit && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading || isRemoving}
              >
                <Trash2 size={16} />
                {isRemoving ? 'Removing...' : 'Remove'}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            {canEdit && !isOwner && (
              <button
                onClick={handleUpdate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                <Save size={16} />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMemberModal;
