import React, { useState } from 'react';
import { Plus, Settings2, Palette, Image, Type, Grid3x3, Video, Code, Box, Workflow, Boxes, Pencil, Settings } from 'lucide-react';
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

      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        {/* Add Content Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Add Content</h3>
        <div className="grid grid-cols-2 gap-3">
          {contentTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.type}
                onClick={() => tool.type && addBlock(tool.type)}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <Icon className="w-6 h-6 text-gray-700 mb-2 group-hover:text-gray-900" />
                <span className="text-xs text-gray-700 text-center group-hover:text-gray-900">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Edit Project Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Edit Project</h3>
        <div className="grid grid-cols-2 gap-3">
          {editTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.label}
                onClick={tool.onClick}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer group"
              >
                <Icon className="w-6 h-6 text-gray-700 mb-2 group-hover:text-gray-900" />
                <span className="text-xs text-gray-700 text-center group-hover:text-gray-900">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Button Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Custom Button</h3>
        <p className="text-xs text-gray-500 mb-4">Customize the call to action on your project</p>
      </div>

      {/* Attach Assets Section */}
      <div className="p-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Attach Assets</h3>
        <button className="w-full flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-gray-900 hover:bg-gray-50 transition-all cursor-pointer group">
          <span className="text-sm text-gray-700 group-hover:text-gray-900">📎 Attach Assets</span>
        </button>
        <p className="text-xs text-gray-500 mt-3 text-center">
          Add files like fonts, illustrations, photos, zips, or templates as free or paid downloads.
        </p>
      </div>

      {/* Continue Button */}
      <div className="mt-auto p-6">
        <button 
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Publishing...' : 'Continue'}
        </button>
      </div>
      </div>
    </>
  );
};

export default EditorSidebar;
