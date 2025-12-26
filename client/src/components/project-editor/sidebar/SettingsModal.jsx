import React, { useState, useEffect } from 'react';
import { X, Upload, Settings, ImagePlus, FileText, Tag, Folder, Wrench, Eye, Rocket, Save } from 'lucide-react';
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

      const successMessage = projectId ? 'Project updated successfully!' : 'Project published successfully!';
      toast.success(successMessage);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-[900px] max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Project Settings</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex">
          {/* Left Column - Cover Image */}
          <div className="w-[350px] p-6 border-r border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2 mb-3">
              <ImagePlus className="w-4 h-4 text-blue-600" />
              <label className="text-sm font-semibold text-gray-900">
                Project Cover <span className="text-red-500">*</span>
              </label>
            </div>

            {!formData.coverImagePreview ? (
              <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <span className="text-blue-600 font-semibold mb-1">Upload Cover Image</span>
                <span className="text-xs text-gray-400">Click to browse</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative group">
                <img
                  src={formData.coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, coverImage: null, coverImagePreview: null }))}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-gray-700" />
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 mt-3 text-center">
              Minimum size: 808 x 632px<br/>
              GIF files will not animate
            </p>
          </div>

          {/* Right Column - Project Information */}
          <div className="flex-1 p-6">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
              <FileText className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Project Information</h3>
            </div>

            {/* Title */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Give your project a title"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Description */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Add a short description for your project"
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Tags */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-semibold text-gray-900">
                  Tags <span className="text-gray-400 font-normal">(limit of 10)</span>
                </label>
              </div>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="Add keywords separated by commas"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Category */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Folder className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-semibold text-gray-900">
                  Category <span className="text-red-500">*</span> <span className="text-gray-400 font-normal">(limit of 3)</span>
                </label>
              </div>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="How would you categorize this project?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Tools Used */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-semibold text-gray-900">
                  Tools Used
                </label>
              </div>
              <input
                type="text"
                name="toolsUsed"
                value={formData.toolsUsed}
                onChange={handleInputChange}
                placeholder="What software, hardware, or materials did you use?"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>

            {/* Visibility */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-gray-400" />
                <label className="text-sm font-semibold text-gray-900">
                  Visibility <span className="text-red-500">*</span>
                </label>
              </div>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="everyone">Everyone</option>
                <option value="connections">Connections Only</option>
                <option value="private">Private</option>
              </select>
              <p className="text-xs text-gray-400 mt-2">
                Fully accessible and discoverable to anyone
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 text-gray-700 hover:bg-gray-200 rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAsDraft}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium disabled:opacity-50 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {isLoading ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 shadow-lg shadow-green-600/25"
          >
            <Rocket className="w-4 h-4" />
            {isLoading 
              ? (projectId ? 'Updating...' : 'Publishing...') 
              : (projectId ? 'Update' : 'Publish')
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
