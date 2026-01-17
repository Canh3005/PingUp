import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import uploadApi from '../../../api/uploadApi';

const GeneralSettings = ({ 
  project, 
  formData, 
  handleInputChange, 
  newTag, 
  setNewTag, 
  handleAddTag, 
  handleRemoveTag, 
}) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadApi.uploadImage(file);
      
      if (response.success && response.result?.url) {
        handleInputChange('logo', response.result.url);
        toast.success('Logo uploaded successfully');
      } else if (response.url) { // Handle different response structure if any
         handleInputChange('logo', response.url);
         toast.success('Logo uploaded successfully');
      } else {
         toast.error('Failed to get image URL');
      }

    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>

      {/* Project Logo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Logo</label>
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handleLogoClick}>
            <img
              src={formData.logo || project.logo || "https://placehold.co/200x200?text=Project"}
              alt={project.name}
              className={`w-20 h-20 rounded-xl object-cover transition-opacity ${isUploading ? 'opacity-50' : ''}`}
            />
            <div className={`absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              {isUploading ? (
                <Loader2 size={24} className="text-white animate-spin" />
              ) : (
                 <Camera size={24} className="text-white" />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <button 
              onClick={handleLogoClick}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Change Logo'}
            </button>
            <p className="text-xs text-gray-500 mt-2">Recommended: 200x200px, PNG or JPG</p>
          </div>
        </div>
      </div>

      {/* Project Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-blue-900"
              >
                <span className="sr-only">Remove</span>
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add a tag..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTag}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
