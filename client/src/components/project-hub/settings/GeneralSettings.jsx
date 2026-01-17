import React from 'react';
import { Camera } from 'lucide-react';

const GeneralSettings = ({ 
  project, 
  formData, 
  handleInputChange, 
  newTag, 
  setNewTag, 
  handleAddTag, 
  handleRemoveTag 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">General Settings</h2>

      {/* Project Logo */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Logo</label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={project.logo}
              alt={project.name}
              className="w-20 h-20 rounded-xl object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </button>
          </div>
          <div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
              Change Logo
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
