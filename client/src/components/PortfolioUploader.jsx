import React, { useState } from 'react';
import { Upload, X, Loader2, FileImage, FileVideo, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import uploadApi from '../api/uploadApi';

const PortfolioUploader = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState('');

  const getFileIcon = (type) => {
    if (type.startsWith('image')) return <FileImage className="w-8 h-8 text-gray-900" />;
    if (type.startsWith('video')) return <FileVideo className="w-8 h-8 text-gray-900" />;
    if (type === 'application/pdf') return <FileText className="w-8 h-8 text-gray-900" />;
    return <Upload className="w-8 h-8 text-gray-400" />;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'application/pdf'
    ];
    
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid file (Image, Video, or PDF)');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFileType(file.type);

    // Show preview for images
    if (file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(file.name);
    }

    // Upload
    try {
      setIsUploading(true);

      const result = await uploadApi.uploadPortfolio(file);
      
      if (result.success) {
        toast.success('Portfolio item uploaded successfully!');
        onUploadSuccess({
          url: result.url,
          publicId: result.publicId,
          type: result.resourceType || 'image',
          format: result.format
        });
        setPreview(null);
        setFileType('');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to upload file';
      toast.error(errorMessage);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileType('');
  };

  return (
    <div className="relative">
      <input
        type="file"
        id="portfolio-upload"
        className="hidden"
        accept="image/*,video/mp4,video/webm,application/pdf"
        onChange={handleFileSelect}
        disabled={isUploading}
      />
      
      {preview ? (
        <div className="relative group border-2 border-gray-300 rounded-lg p-4">
          {fileType.startsWith('image') ? (
            <img
              src={preview}
              alt="Portfolio preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-48">
              {getFileIcon(fileType)}
              <span className="ml-2 text-sm text-gray-600">{preview}</span>
            </div>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
          
          <button
            onClick={handleRemove}
            type="button"
            className="absolute top-2 right-2 p-2 bg-white rounded-full cursor-pointer hover:bg-gray-100 shadow-md"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      ) : (
        <label
          htmlFor="portfolio-upload"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-900 transition-colors h-48"
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload portfolio item</span>
              <span className="text-xs text-gray-400 mt-1">Image, Video, or PDF (max 10MB)</span>
            </>
          )}
        </label>
      )}
    </div>
  );
};

export default PortfolioUploader;
