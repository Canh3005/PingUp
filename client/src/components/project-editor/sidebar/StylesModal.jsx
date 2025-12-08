import React, { useState, useEffect } from 'react';
import { X, Palette, Space } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[550px] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Project Styles</h2>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {/* Background Color */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Background Color</label>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="relative">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-14 h-14 rounded-xl cursor-pointer border-2 border-gray-200"
                />
              </div>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-gray-400 font-mono">#</span>
                <input
                  type="text"
                  value={backgroundColor.replace('#', '').toUpperCase()}
                  onChange={(e) => setBackgroundColor('#' + e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
                  placeholder="FFFFFF"
                  maxLength="6"
                />
              </div>
            </div>
          </div>

          {/* Content Spacing */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-900">Content Spacing</label>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                <input
                  type="number"
                  value={contentSpacing}
                  onChange={(e) => setContentSpacing(Number(e.target.value))}
                  className="w-14 bg-transparent text-center focus:outline-none font-medium text-gray-900"
                  min="0"
                  max="200"
                />
                <span className="text-sm text-gray-500">px</span>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <input
                type="range"
                value={contentSpacing}
                onChange={(e) => setContentSpacing(Number(e.target.value))}
                min="0"
                max="200"
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>0px</span>
                <span>100px</span>
                <span>200px</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-600/25"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StylesModal;
