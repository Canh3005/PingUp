import React, { useState, useEffect } from 'react';
import { X, Calendar, Target, AlertCircle, Loader2 } from 'lucide-react';
import milestoneApi from '../../../api/milestoneApi';

const CreateMilestoneModal = ({ isOpen, onClose, projectHubId, onMilestoneCreated, editMilestone = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fromDate: '',
    dueDate: '',
    status: 'Not Started',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when editMilestone changes
  useEffect(() => {
    if (editMilestone) {
      setFormData({
        title: editMilestone.title || '',
        description: editMilestone.description || '',
        fromDate: editMilestone.fromDate ? new Date(editMilestone.fromDate).toISOString().split('T')[0] : '',
        dueDate: editMilestone.dueDate ? new Date(editMilestone.dueDate).toISOString().split('T')[0] : '',
        status: editMilestone.status || 'Not Started',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        fromDate: '',
        dueDate: '',
        status: 'Not Started',
      });
    }
  }, [editMilestone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let result;
      if (editMilestone) {
        // Update existing milestone
        const response = await milestoneApi.updateMilestone(editMilestone._id, formData);
        result = response.data || response;
      } else {
        // Create new milestone
        const milestoneData = {
          ...formData,
          projectHubId,
        };
        const response = await milestoneApi.createMilestone(milestoneData);
        result = response.data || response;
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        fromDate: '',
        dueDate: '',
        status: 'Not Started',
      });

      // Notify parent
      if (onMilestoneCreated) {
        onMilestoneCreated(result);
      }

      onClose();
    } catch (err) {
      console.error('Error saving milestone:', err);
      setError(err.response?.data?.message || 'Failed to save milestone');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {editMilestone ? 'Edit Milestone' : 'Create New Milestone'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter milestone title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Describe what this milestone represents..."
            />
          </div>

          {/* Date Range & Status */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Target size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">About Milestones</p>
                <p>Milestones help you track major goals and deliverables. Tasks can be organized under milestones to measure progress.</p>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Saving...' : editMilestone ? 'Update Milestone' : 'Create Milestone'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateMilestoneModal;
