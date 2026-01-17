import React from 'react';
import { Globe, Lock, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { VISIBILITY_OPTIONS, PROJECT_VISIBILITY } from '../../../constants/projectVisibility';

const VisibilitySettings = ({ project, formData, handleInputChange }) => {
  const handleCopyLink = () => {
    const link = `${window.location.origin}/project-hub/${project._id}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Visibility & Access</h2>

      {/* Visibility Options */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 mb-4">Project Visibility</label>

        {VISIBILITY_OPTIONS.map((option) => {
          const IconComponent = option.icon === 'Globe' ? Globe : Lock;
          const isSelected = formData.visibility === option.value;
          
          return (
            <div
              key={option.value}
              onClick={() => handleInputChange('visibility', option.value)}
              className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <IconComponent size={24} className={isSelected ? 'text-blue-600' : 'text-gray-500'} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{option.label}</p>
                  {isSelected && (
                    <Check size={16} className="text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {option.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Link */}
      <div className="mt-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}/project-hub/${project._id}`}
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600 text-sm"
          />
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy size={18} />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisibilitySettings;
