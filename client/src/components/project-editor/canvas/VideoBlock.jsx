import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown, Video as VideoIcon, Link } from 'lucide-react';

const VideoBlock = ({ block, updateBlock, deleteBlock, moveBlock, isFirst, isLast, onFocus, onBlur }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isEmbedMode, setIsEmbedMode] = useState(false);

  useEffect(() => {
    // Initialize video URL from block content
    if (block.content instanceof File) {
      const url = URL.createObjectURL(block.content);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else if (typeof block.content === 'string') {
      setVideoUrl(block.content);
    }
  }, [block.content]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      // Store the File object for upload
      updateBlock(block.id, file);
    }
  };

  const handleEmbedSubmit = (e) => {
    e.preventDefault();
    updateBlock(block.id, videoUrl);
    setIsEmbedMode(false);
  };

  return (
    <div 
      className="group relative rounded-lg transition-colors"
      onClick={() => onFocus?.()}
      onMouseLeave={() => onBlur?.()}
    >
      {!videoUrl ? (
        <div className="flex flex-col items-center justify-center py-20 cursor-pointer border-2 border-dashed border-gray-300">
          <VideoIcon className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-gray-600 mb-4">Add video or audio</span>
          
          <div className="flex gap-3">
            <label className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File
              <input
                type="file"
                accept="video/*,audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <button
              onClick={() => setIsEmbedMode(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-900 transition-colors"
            >
              <Link className="w-4 h-4 inline mr-2" />
              Embed URL
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <video src={videoUrl} controls className="w-full h-auto" />
        </div>
      )}

      {/* Embed Form */}
      {isEmbedMode && (
        <div className="absolute inset-0 bg-white p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-4">Embed Video URL</h3>
          <form onSubmit={handleEmbedSubmit} className="w-full max-w-md">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-2 mb-4"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Embed
              </button>
              <button
                type="button"
                onClick={() => setIsEmbedMode(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isFirst && (
          <button
            onClick={() => moveBlock(block.id, 'up')}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-gray-700" />
          </button>
        )}
        {!isLast && (
          <button
            onClick={() => moveBlock(block.id, 'down')}
            className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          >
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </button>
        )}
        <button
          onClick={() => deleteBlock(block.id)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default VideoBlock;