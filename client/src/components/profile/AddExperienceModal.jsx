import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import profileApi from '../../api/profileApi';

const AddExperienceModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    organization: '',
    startYear: '',
    endYear: '',
    description: '',
    currentlyWorking: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync form data with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        jobTitle: initialData.jobTitle || '',
        organization: initialData.organization || '',
        startYear: initialData.startYear || '',
        endYear: initialData.endYear || '',
        description: initialData.description || '',
        currentlyWorking: initialData.currentlyWorking || false,
      });
    } else {
      // Reset form when adding new
      setFormData({
        jobTitle: '',
        organization: '',
        startYear: '',
        endYear: '',
        description: '',
        currentlyWorking: false,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const dataToSave = {
      jobTitle: formData.jobTitle,
      organization: formData.organization,
      startYear: formData.startYear,
      endYear: formData.currentlyWorking ? '' : formData.endYear,
      currentlyWorking: formData.currentlyWorking,
      description: formData.description,
    };

    try {
      let result;
      if (initialData && initialData._id) {
        // Update existing experience
        result = await profileApi.updateExperience(initialData._id, dataToSave);
        toast.success('Experience updated successfully!');
      } else {
        // Add new experience
        result = await profileApi.addExperience(dataToSave);
        toast.success('Experience added successfully!');
      }
      
      if (result.success && onSuccess) {
        onSuccess(result.profile);
      }
      onClose();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error(error.response?.data?.message || 'Failed to save experience');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?._id) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this experience?');
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      const result = await profileApi.deleteExperience(initialData._id);
      toast.success('Experience deleted successfully!');
      
      if (result.success && onSuccess) {
        onSuccess(result.profile);
      }
      onClose();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error(error.response?.data?.message || 'Failed to delete experience');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/30 pt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[calc(90vh-4rem)] flex flex-col">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Experience' : 'Add Experience'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="e.g., Senior UI/UX Designer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Organization */}
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
                  Organization *
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  placeholder="e.g., Google"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Start Year */}
              <div>
                <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Year *
                </label>
                <input
                  type="text"
                  id="startYear"
                  name="startYear"
                  value={formData.startYear}
                  onChange={handleChange}
                  placeholder="e.g., 2023"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Current Position Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="currentlyWorking"
                  name="currentlyWorking"
                  checked={formData.currentlyWorking}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="currentlyWorking" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  I currently work here
                </label>
              </div>

              {/* End Year */}
              {!formData.currentlyWorking && (
                <div>
                  <label htmlFor="endYear" className="block text-sm font-medium text-gray-700 mb-2">
                    End Year *
                  </label>
                  <input
                    type="text"
                    id="endYear"
                    name="endYear"
                    value={formData.endYear}
                    onChange={handleChange}
                    placeholder="e.g., 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required={!formData.currentlyWorking}
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between px-6 py-4 border-t border-gray-200 bg-white rounded-b-lg">
            {/* Delete button - only show when editing */}
            {initialData && initialData._id ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                Delete
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExperienceModal;