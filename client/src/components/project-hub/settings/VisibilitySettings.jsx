import React from 'react';
import { Globe, Lock, Check, Copy } from 'lucide-react';

const VisibilitySettings = ({ project, formData, handleInputChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Visibility & Access</h2>

      {/* Visibility Options */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-4">Project Visibility</label>

        <div
          onClick={() => handleInputChange('visibility', 'public')}
          className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
            formData.visibility === 'public'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`p-2 rounded-lg ${formData.visibility === 'public' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Globe size={24} className={formData.visibility === 'public' ? 'text-blue-600' : 'text-gray-500'} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">Public</p>
              {formData.visibility === 'public' && (
                <Check size={16} className="text-blue-600" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Anyone can view this project. It will appear in search results and on your profile.
            </p>
          </div>
        </div>

        <div
          onClick={() => handleInputChange('visibility', 'private')}
          className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
            formData.visibility === 'private'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`p-2 rounded-lg ${formData.visibility === 'private' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Lock size={24} className={formData.visibility === 'private' ? 'text-blue-600' : 'text-gray-500'} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">Private</p>
              {formData.visibility === 'private' && (
                <Check size={16} className="text-blue-600" />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Only you and invited team members can view this project.
            </p>
          </div>
        </div>
      </div>

      {/* Share Link */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`https://ping.app/project/${project.id}`}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
          />
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Copy size={18} />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettings;
