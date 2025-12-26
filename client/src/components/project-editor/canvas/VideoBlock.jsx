import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown, Video as VideoIcon, Link, X } from 'lucide-react';

const VideoBlock = ({ block, updateBlock, deleteBlock, moveBlock, isFirst, isLast, onFocus, onBlur }) => {
  const [videoUrl, setVideoUrl] = useState(null);
  const [isEmbedMode, setIsEmbedMode] = useState(false);

  useEffect(() => {
    // Initialize video URL - prioritize mediaUrl (from database) over content
    if (block.mediaUrl) {
      // Load from database - mediaUrl contains the Cloudinary URL
      setVideoUrl(block.mediaUrl);
    } else if (block.content instanceof File) {
      const url = URL.createObjectURL(block.content);
      setVideoUrl(url);
      return () => URL.revokeObjectURL(url); // Cleanup
    } else if (typeof block.content === 'string' && block.content) {
      setVideoUrl(block.content);
    }
  }, [block.content, block.mediaUrl]);

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
      className="group relative transition-all"
      onClick={() => onFocus?.()}
      onMouseLeave={() => onBlur?.()}
    >
      {!videoUrl ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 hover:border-red-400 hover:bg-red-50/30 transition-all">
          <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <VideoIcon className="w-10 h-10 text-red-600" />
          </div>
          <span className="text-gray-700 font-medium mb-4">Add video or audio</span>

          <div className="flex gap-3">
            <label className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all cursor-pointer shadow-lg">
              <Upload className="w-4 h-4" />
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
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <Link className="w-4 h-4" />
              Embed URL
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden">
          <video src={videoUrl} controls className="w-full h-auto" />
        </div>
      )}

      {/* Embed Form */}
      {isEmbedMode && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center justify-center z-10">
          <button
            onClick={() => setIsEmbedMode(false)}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
            <Link className="w-7 h-7 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Embed Video URL</h3>

          <form onSubmit={handleEmbedSubmit} className="w-full max-w-md">
            <input
              type="url"
              value={videoUrl || ''}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-600/25"
              >
                Embed Video
              </button>
              <button
                type="button"
                onClick={() => setIsEmbedMode(false)}
                className="flex-1 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
        {!isFirst && (
          <button
            onClick={() => moveBlock(block.id, 'up')}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            <ChevronUp className="w-4 h-4 text-gray-700" />
          </button>
        )}
        {!isLast && (
          <button
            onClick={() => moveBlock(block.id, 'down')}
            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-white hover:scale-105 transition-all"
          >
            <ChevronDown className="w-4 h-4 text-gray-700" />
          </button>
        )}
        <button
          onClick={() => deleteBlock(block.id)}
          className="p-2.5 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:bg-red-50 hover:scale-105 transition-all"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </div>
  );
};

export default VideoBlock;