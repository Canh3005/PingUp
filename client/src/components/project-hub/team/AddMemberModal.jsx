import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { 
  PROJECT_HUB_ROLES, 
  ROLE_LABELS, 
  ROLE_DESCRIPTIONS,
  getAssignableRoles 
} from '../../../constants/projectHubRoles';
import projectHubApi from '../../../api/projectHubApi';

const AddMemberModal = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [formData, setFormData] = useState({
    memberId: '',
    permissionRole: PROJECT_HUB_ROLES.MEMBER,
    jobPosition: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.memberId.trim()) {
      setError('Please enter a user ID or email');
      return;
    }

    try {
      setIsLoading(true);
      await projectHubApi.addMember(projectId, formData);
      onSuccess();
      onClose();
      setFormData({
        memberId: '',
        permissionRole: PROJECT_HUB_ROLES.MEMBER,
        jobPosition: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Add Team Member</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* User ID / Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID or Email *
            </label>
            <input
              type="text"
              value={formData.memberId}
              onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
              placeholder="Enter user ID or email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the user's profile ID or registered email
            </p>
          </div>

          {/* Permission Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Permission Role *
            </label>
            <select
              value={formData.permissionRole}
              onChange={(e) => setFormData({ ...formData, permissionRole: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
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
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              The member's role in the project (optional)
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
