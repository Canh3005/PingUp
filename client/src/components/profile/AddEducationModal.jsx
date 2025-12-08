import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import profileApi from '../../api/profileApi';

const AddEducationModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync form data with initialData when it changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        school: initialData.school || '',
        degree: initialData.degree || '',
        fieldOfStudy: initialData.fieldOfStudy || '',
        startYear: initialData.startYear || '',
        endYear: initialData.endYear || '',
      });
    } else {
      // Reset form when adding new
      setFormData({
        school: '',
        degree: '',
        fieldOfStudy: '',
        startYear: '',
        endYear: '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let result;
      if (initialData && initialData._id) {
        // Update existing education
        result = await profileApi.updateEducation(initialData._id, formData);
        toast.success('Education updated successfully!');
      } else {
        // Add new education
        result = await profileApi.addEducation(formData);
        toast.success('Education added successfully!');
      }
      
      if (result.success && onSuccess) {
        onSuccess(result.profile);
      }
      onClose();
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error(error.response?.data?.message || 'Failed to save education');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?._id) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this education?');
    if (!confirmDelete) return;

    setIsLoading(true);

    try {
      const result = await profileApi.deleteEducation(initialData._id);
      toast.success('Education deleted successfully!');
      
      if (result.success && onSuccess) {
        onSuccess(result.profile);
      }
      onClose();
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error(error.response?.data?.message || 'Failed to delete education');
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
            {initialData ? 'Edit Education' : 'Add Education'}
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
              {/* School */}
              <div>
                <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                  School *
                </label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="e.g., Stanford University"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Degree */}
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
                  Degree *
                </label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g., Bachelor's, Master's"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Field of Study */}
              <div>
                <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
                  Field of Study *
                </label>
                <input
                  type="text"
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  placeholder="e.g., Computer Science"
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
                  placeholder="e.g., 2019"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* End Year */}
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
                  placeholder="e.g., 2023"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
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

export default AddEducationModal;