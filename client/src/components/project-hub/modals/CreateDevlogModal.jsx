import React, { useState } from 'react';
import { X, Image, Video, Bold, Italic, List, Link2, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import devlogApi from '../../../api/devlogApi';
import uploadApi from '../../../api/uploadApi';

const CreateDevlogModal = ({ isOpen, onClose, projectHubId, onDevlogCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visibility: 'team',
  });
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingMedia(true);
    setError('');

    try {
      const uploadPromises = files.map(async (file) => {
        const fileType = file.type.startsWith('image/') ? 'image' : 
                        file.type.startsWith('video/') ? 'video' : 'audio';
        
        let uploadedFile;
        if (fileType === 'image') {
          uploadedFile = await uploadApi.uploadImage(file);
        } else if (fileType === 'video') {
          uploadedFile = await uploadApi.uploadVideo(file);
        } else {
          throw new Error('Unsupported file type');
        }

        return {
          type: fileType,
          url: uploadedFile.url,
          title: file.name,
          preview: fileType === 'image' ? uploadedFile.url : null,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setMediaFiles([...mediaFiles, ...uploadedFiles]);
    } catch (err) {
      console.error('Error uploading files:', err);
      setError(err.response?.data?.message || 'Failed to upload files');
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleRemoveMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const devlogData = {
        ...formData,
        projectHub: projectHubId,
        media: mediaFiles.map(file => ({
          type: file.type,
          url: file.url,
          title: file.title,
        })),
      };

      const newDevlog = await devlogApi.createDevlog(devlogData);
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        visibility: 'team',
      });
      setMediaFiles([]);

      // Notify parent
      if (onDevlogCreated) {
        onDevlogCreated(newDevlog);
      }

      onClose();
    } catch (err) {
      console.error('Error creating devlog:', err);
      setError(err.response?.data?.message || 'Failed to create devlog');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Create Development Update</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <form id="devlog-form" onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What did you work on?"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            
            {/* Simple Editor Toolbar */}
            <div className="flex items-center gap-1 p-2 border border-gray-300 border-b-0 rounded-t-lg bg-gray-50">
              <button
                type="button"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Bold"
              >
                <Bold size={16} />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Italic"
              >
                <Italic size={16} />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="List"
              >
                <List size={16} />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Link"
              >
                <Link2 size={16} />
              </button>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                type="button"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Image"
              >
                <Image size={16} />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-gray-200 rounded transition-colors"
                title="Video"
              >
                <Video size={16} />
              </button>
            </div>

            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-b-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Share your progress, challenges, or achievements..."
              required
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="team">Team Only</option>
              <option value="public">Public</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.visibility === 'team' 
                ? 'Only team members can see this update'
                : 'Anyone can see this update on your project page'}
            </p>
          </div>

          {/* Media Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media (optional)
            </label>
            
            <input
              type="file"
              id="media-upload"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploadingMedia}
            />
            
            <label
              htmlFor="media-upload"
              className={`block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer ${
                uploadingMedia ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="flex justify-center gap-4 mb-3">
                {uploadingMedia ? (
                  <Loader2 size={24} className="text-blue-500 animate-spin" />
                ) : (
                  <>
                    <Image size={24} className="text-gray-400" />
                    <Video size={24} className="text-gray-400" />
                  </>
                )}
              </div>
              <p className="text-gray-600">
                {uploadingMedia ? 'Uploading...' : 'Drag and drop files here, or click to browse'}
              </p>
              <p className="text-sm text-gray-400 mt-1">Supports images and videos</p>
            </label>

            {/* Media Preview */}
            {mediaFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.title}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Video size={32} className="text-gray-400" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 truncate">{file.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="devlog-form"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDevlogModal;
