import React, { useState } from 'react';
import { Image, Type, Grid3x3, Video, Code, Box, Workflow, Boxes, Pencil, Settings, Paperclip, Compass, ChevronLeft, Rocket } from 'lucide-react';
import StylesModal from './sidebar/StylesModal';
import SettingsModal from './sidebar/SettingsModal';
import projectApi from '../../api/projectApi';
import uploadApi from '../../api/uploadApi';
import { uploadBlocks } from '../../utils/uploadBlocks';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; 

const EditorSidebar = ({ addBlock, projectStyles, setProjectStyles, setPreviewStyles, projectData, setProjectData, blocks, projectId, setProjectId }) => {
  const [showStylesModal, setShowStylesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async () => {
    // Check if required fields are filled
    if (!projectData.title || !projectData.coverImage || !projectData.category) {
      setShowSettingsModal(true);
    } else {
      // Save and publish project directly
      try {
        setIsLoading(true);
        
        // Process tags
        const tagsArray = Array.isArray(projectData.tags) 
          ? projectData.tags 
          : projectData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

        // Upload cover image if it's a File instance
        let coverImageUrl = projectData.coverImage;
        if (projectData.coverImage instanceof File) {
          const uploadResponse = await uploadApi.uploadCover(projectData.coverImage);
          coverImageUrl = uploadResponse.url;
        }

        // Upload media for blocks (images and videos)
        const uploadedBlocks = await uploadBlocks(blocks);

        // Build project payload
        const projectPayload = {
          title: projectData.title,
          description: projectData.description,
          tags: tagsArray,
          category: projectData.category,
          toolsUsed: projectData.toolsUsed,
          visibility: projectData.visibility,
          coverImage: coverImageUrl,
          blocks: uploadedBlocks,
          styles: projectStyles,
          status: 'published',
        };

        let response;
        if (projectId) {
          // Update existing project
          response = await projectApi.updateProject(projectId, projectPayload);
          await projectApi.publishProject(projectId);
        } else {
          // Create new project
          response = await projectApi.createProject(projectPayload);
          setProjectId(response.data._id);
          await projectApi.publishProject(response.data._id);
        }

        toast.success('Project published successfully!');
        setIsLoading(false);
        navigate(`/project/${response.data._id}`);
      } catch (error) {
        console.error('Error publishing project:', error);
        toast.error('Failed to publish project. Please try again.');
        setIsLoading(false);
      }
    }
  };
  const contentTools = [
    { icon: Image, label: 'Image', type: 'image' },
    { icon: Type, label: 'Text', type: 'text' },
    { icon: Grid3x3, label: 'Photo Grid', type: 'photo-grid' },
    { icon: Video, label: 'Video/Audio', type: 'video' },
    { icon: Code, label: 'Embed', type: 'embed' },
    { icon: Box, label: 'Lightroom', type: 'lightroom' },
    { icon: Workflow, label: 'Prototype', type: 'prototype' },
    { icon: Boxes, label: '3D', type: '3d' },
  ];

  const editTools = [
    { icon: Pencil, label: 'Styles', onClick: () => setShowStylesModal(true) },
    { icon: Settings, label: 'Settings', onClick: () => setShowSettingsModal(true) },
  ];

  return (
    <>
      <StylesModal 
        isOpen={showStylesModal} 
        onClose={() => setShowStylesModal(false)}
        projectStyles={projectStyles}
        setProjectStyles={setProjectStyles}
        setPreviewStyles={setPreviewStyles}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        projectData={projectData}
        setProjectData={setProjectData}
        blocks={blocks}
        projectStyles={projectStyles}
        projectId={projectId}
        setProjectId={setProjectId}
      />

      <div className="w-80 bg-white border-l border-gray-100 flex flex-col shadow-sm mt-8 rounded-l-2xl overflow-hidden">
        {/* Header with Back Button */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all group"
            title="Back to Explore"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <Compass className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-200"></div>
          <h2 className="font-bold text-gray-900">Project Editor</h2>
        </div>

        {/* Add Content Section */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Image className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Add Content</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {contentTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.type}
                  onClick={() => tool.type && addBlock(tool.type)}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group"
                >
                  <Icon className="w-5 h-5 text-gray-500 mb-1.5 group-hover:text-blue-600 transition-colors" />
                  <span className="text-xs text-gray-600 text-center group-hover:text-blue-700 font-medium">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Edit Project Section */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Edit Project</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {editTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  onClick={tool.onClick}
                  className="flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-purple-50 hover:border-purple-200 transition-all cursor-pointer group"
                >
                  <Icon className="w-5 h-5 text-gray-500 mb-1.5 group-hover:text-purple-600 transition-colors" />
                  <span className="text-xs text-gray-600 text-center group-hover:text-purple-700 font-medium">{tool.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Attach Assets Section */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
              <Paperclip className="w-4 h-4 text-orange-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Attach Assets</h3>
          </div>
          <button className="w-full flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all cursor-pointer group">
            <Paperclip className="w-4 h-4 text-gray-500 group-hover:text-orange-600" />
            <span className="text-sm text-gray-600 group-hover:text-orange-700 font-medium">Attach Files</span>
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center leading-relaxed">
            Add fonts, illustrations, photos, or templates as downloads.
          </p>
        </div>

        {/* Publish Button */}
        <div className="mt-auto p-5">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <Rocket className="w-4 h-4" />
            {isLoading ? 'Publishing...' : 'Publish Project'}
          </button>
        </div>
      </div>
    </>
  );
};

export default EditorSidebar;
