import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import projectApi from '../../../api/projectApi';
import uploadApi from '../../../api/uploadApi';
import { uploadBlocks } from '../../../utils/uploadBlocks';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SettingsModal = ({ isOpen, onClose, projectData, setProjectData, blocks, projectStyles, projectId, setProjectId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    category: '',
    toolsUsed: '',
    visibility: 'everyone',
    coverImage: null,
    coverImagePreview: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && projectData) {
      setFormData({
        title: projectData.title || '',
        description: projectData.description || '',
        tags: projectData.tags?.join(', ') || '',
        category: projectData.category || '',
        toolsUsed: projectData.toolsUsed || '',
        visibility: projectData.visibility || 'everyone',
        coverImage: projectData.coverImage || null,
        coverImagePreview: projectData.coverImagePreview || null,
      });
    }
  }, [isOpen, projectData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          coverImage: file,
          coverImagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      setIsLoading(true);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Upload cover image if it's a new file
      let coverImageUrl = formData.coverImage;
      if (formData.coverImage instanceof File) {
        try {
          const uploadResponse = await uploadApi.uploadCover(formData.coverImage);
          coverImageUrl = uploadResponse.url;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to upload cover image';
          toast.error(errorMessage);
          setIsLoading(false);
          return;
        }
      }

      // Upload media for blocks (images and videos)
      let uploadedBlocks;
      try {
        uploadedBlocks = await uploadBlocks(blocks);
      } catch (error) {
        toast.error(error.message || 'Failed to upload block content');
        setIsLoading(false);
        return;
      }

      const projectPayload = {
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        category: formData.category,
        toolsUsed: formData.toolsUsed,
        visibility: formData.visibility,
        coverImage: coverImageUrl,
        blocks: uploadedBlocks,
        styles: projectStyles,
        status: 'draft',
      };

      let response;
      if (projectId) {
        response = await projectApi.updateProject(projectId, projectPayload);
      } else {
        response = await projectApi.createProject(projectPayload);
        setProjectId(response.data._id);
      }

      setProjectData({
        ...formData,
        tags: tagsArray,
        coverImage: coverImageUrl,
        status: 'draft',
      });

      toast.success('Project saved as draft successfully!');
      onClose();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error.message || 'Failed to save project');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      // Validate required fields
      if (!formData.title || !formData.coverImage || !formData.category) {
        alert('Please fill in all required fields (Title, Cover Image, Category)');
        return;
      }

      setIsLoading(true);
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Upload cover image if it's a new file
      let coverImageUrl = formData.coverImage;
      if (formData.coverImage instanceof File) {
        try {
          const uploadResponse = await uploadApi.uploadCover(formData.coverImage);
          coverImageUrl = uploadResponse.url;
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to upload cover image';
          toast.error(errorMessage);
          setIsLoading(false);
          return;
        }
      }

      // Upload media for blocks (images and videos)
      let uploadedBlocks;
      try {
        uploadedBlocks = await uploadBlocks(blocks);
      } catch (error) {
        toast.error(error.message || 'Failed to upload block content');
        setIsLoading(false);
        return;
      }

      const projectPayload = {
        title: formData.title,
        description: formData.description,
        tags: tagsArray,
        category: formData.category,
        toolsUsed: formData.toolsUsed,
        visibility: formData.visibility,
        coverImage: coverImageUrl,
        blocks: uploadedBlocks,
        styles: projectStyles,
      };

      let response;
      if (projectId) {
        // Update existing project
        response = await projectApi.updateProject(projectId, projectPayload);
        // Publish it
        await projectApi.publishProject(projectId);
      } else {
        // Create new project
        response = await projectApi.createProject(projectPayload);
        const newProjectId = response.data._id;
        setProjectId(newProjectId);
        // Publish it
        await projectApi.publishProject(newProjectId);
      }

      setProjectData({
        ...formData,
        tags: tagsArray,
        coverImage: coverImageUrl,
        status: 'published',
      });

      toast.success('Project published successfully!');
      navigate(`/project/${response.data._id}`);
      onClose();
    } catch (error) {
      console.error('Error publishing project:', error);
      toast.error(error.message || 'Failed to publish project');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-[900px] max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Project Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex">
          {/* Left Column - Cover Image */}
          <div className="w-[350px] p-6 border-r border-gray-200">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Project Cover <span className="text-red-500">(required)</span>
            </label>
            
            {!formData.coverImagePreview ? (
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                <Upload className="w-12 h-12 text-blue-600 mb-3" />
                <span className="text-blue-600 font-semibold mb-1">Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img 
                  src={formData.coverImagePreview} 
                  alt="Cover preview" 
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: null }))}
                  className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Minimum size of "808 x 632px"<br/>
              GIF files will not animate.
            </p>
          </div>

          {/* Right Column - Project Information */}
          <div className="flex-1 p-6 h-full">
            <h3 className="text-sm font-bold text-gray-900 mb-4 bg-white pb-2">PROJECT INFORMATION</h3>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title <span className="text-red-500">(required)</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your project a title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add a short description for your project"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tags <span className="text-gray-500">(limit of 10)</span>
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Add up to 10 keywords to help people discover your project"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category <span className="text-red-500">(required, limit of 3)</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="How Would You Categorize This Project?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Tools Used */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tools Used
              </label>
              <input
                type="text"
                name="toolsUsed"
                value={formData.toolsUsed}
                onChange={handleInputChange}
                placeholder="What software, hardware, or materials did you use?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Behance Visibility */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Visibility <span className="text-red-500">(required)</span>
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections Only</option>
                <option value="private">Private</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Fully accessible and discoverable to anyone
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAsDraft}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
          >
            {isLoading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
