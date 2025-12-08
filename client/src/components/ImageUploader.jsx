import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import uploadApi from '../api/uploadApi';

const ImageUploader = ({ type = 'avatar', currentImage, onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload
    try {
      setIsUploading(true);

      let result;
      if (type === 'avatar') {
        result = await uploadApi.uploadAvatar(file);
      } else {
        result = await uploadApi.uploadCover(file);
      }
      
      if (result.success) {
        toast.success(`${type === 'avatar' ? 'Avatar' : 'Cover image'} uploaded successfully!`);
        onUploadSuccess(result.url, result.publicId);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to upload image';
      toast.error(errorMessage);
      setPreview(currentImage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadSuccess('', '');
  };

  return (
    <div className="relative">
      <input
        type="file"
        id={`${type}-upload`}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      
      {preview ? (
        <div className="flex justify-center">
          <div className={`relative group ${type === 'avatar' ? '' : 'w-full'}`}>
            <img
              src={preview}
              alt={type}
              className={`object-cover ${
                type === 'avatar' ? 'w-32 h-32 rounded-full' : 'w-full h-48 rounded-lg'
              }`}
            />
            {isUploading && (
              <div className={`absolute inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center ${
                type === 'avatar' ? 'rounded-full' : 'rounded-lg'
              }`}>
                <Loader2 className="w-8 h-8 text-gray-700 animate-spin" />
              </div>
            )}
            <div className={`absolute inset-0 backdrop-blur-sm bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 ${
              type === 'avatar' ? 'rounded-full' : 'rounded-lg'
            }`}>
            <label
              htmlFor={`${type}-upload`}
              className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100"
            >
              <Upload className="w-5 h-5 text-gray-700" />
            </label>
            <button
              onClick={handleRemove}
              type="button"
              className="p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
        </div>
      ) : (
        <label
          htmlFor={`${type}-upload`}
          className={`flex flex-col items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-900 transition-colors ${
            type === 'avatar' ? 'w-32 h-32 rounded-full mx-auto' : 'h-48 rounded-lg w-full mx-auto'
          }`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500 text-center px-4">Upload {type}</span>
            </>
          )}
        </label>
      )}
    </div>
  );
};

export default ImageUploader;
