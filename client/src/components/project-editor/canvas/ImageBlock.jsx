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
      className="group relative border-gray-300 transition-colors"
      onClick={() => onFocus?.()}
      onMouseLeave={() => onBlur?.()}
    >
      {!preview ? (
        <label className="flex flex-col items-center justify-center py-20 cursor-pointer border-2 border-dashed border-gray-300">
          <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
          <span className="text-gray-600 mb-2">Click to upload image</span>
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

export default ImageBlock;