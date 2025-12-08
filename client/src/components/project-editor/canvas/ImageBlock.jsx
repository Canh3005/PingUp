import React, { useState, useEffect } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';

const ImageBlock = ({ block, updateBlock, deleteBlock, moveBlock, isFirst, isLast, onFocus, onBlur }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Initialize preview from block content
    if (block.content instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(block.content);
    } else if (typeof block.content === 'string') {
      setPreview(block.content);
    }
  }, [block.content]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        // Store the File object for upload, not the base64 string
        updateBlock(block.id, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="group relative transition-all"
      onClick={() => onFocus?.()}
      onMouseLeave={() => onBlur?.()}
    >
      {!preview ? (
        <label className="flex flex-col items-center justify-center py-20 cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 transition-all group/upload">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover/upload:bg-blue-200 transition-colors">
            <ImageIcon className="w-10 h-10 text-blue-600" />
          </div>
          <span className="text-gray-700 font-medium mb-1">Click to upload image</span>
          <span className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="relative">
          <img src={preview} alt="Uploaded" className="w-full h-auto" />
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

export default ImageBlock;