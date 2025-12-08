import React, { useState, useEffect } from 'react';

const StylesModal = ({ isOpen, onClose, projectStyles, setProjectStyles, setPreviewStyles }) => {
  const [backgroundColor, setBackgroundColor] = useState(projectStyles.backgroundColor);
  const [contentSpacing, setContentSpacing] = useState(projectStyles.contentSpacing);

  // Update local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setBackgroundColor(projectStyles.backgroundColor);
      setContentSpacing(projectStyles.contentSpacing);
    }
  }, [isOpen, projectStyles]);

  // Update preview in real-time
  useEffect(() => {
    if (isOpen) {
      setPreviewStyles({
        backgroundColor,
        contentSpacing,
      });
    } else {
      setPreviewStyles(null);
    }
  }, [backgroundColor, contentSpacing, isOpen, setPreviewStyles]);

  const handleSave = () => {
    setProjectStyles({
      backgroundColor,
      contentSpacing,
    });
    setPreviewStyles(null);
    onClose();
  };

  const handleCancel = () => {
    setPreviewStyles(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[600px] p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Project Styles</h2>
        
        {/* Background Color */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer"
            />
            <span className="text-gray-500">or</span>
            <span className="text-gray-400">#</span>
            <input
              type="text"
              value={backgroundColor.replace('#', '')}
              onChange={(e) => setBackgroundColor('#' + e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="FFFFFF"
              maxLength="6"
            />
          </div>
        </div>

        {/* Content Spacing */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-900">Content Spacing</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={contentSpacing}
                onChange={(e) => setContentSpacing(Number(e.target.value))}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:border-blue-500"
                min="0"
                max="200"
              />
              <span className="text-sm text-gray-500">px</span>
            </div>
          </div>
          <input
            type="range"
            value={contentSpacing}
            onChange={(e) => setContentSpacing(Number(e.target.value))}
            min="0"
            max="200"
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StylesModal;
