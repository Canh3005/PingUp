import React, { useState, useEffect } from 'react';
import EditorCanvas from '../components/project-editor/EditorCanvas';
import EditorSidebar from '../components/project-editor/EditorSidebar';

const ProjectEditor = ({ initialProjectData }) => {
  const [blocks, setBlocks] = useState([]);
  const [projectStyles, setProjectStyles] = useState({
    backgroundColor: '#FFFFFF',
    contentSpacing: 60,
  });
  const [previewStyles, setPreviewStyles] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tags: [],
    category: '',
    toolsUsed: '',
    visibility: 'everyone',
    coverImage: null,
    coverImagePreview: null,
    status: 'draft',
  });

  // Load initial project data if editing
  useEffect(() => {
    if (initialProjectData) {
      console.log(initialProjectData.blocks);
      // Set project ID
      setProjectId(initialProjectData._id);

      // Load blocks - convert _id to id for editor compatibility
      if (initialProjectData.blocks) {
        const mappedBlocks = initialProjectData.blocks.map(block => ({
          ...block,
          id: block._id || block.id || Date.now() + Math.random(),
        }));
        setBlocks(mappedBlocks);
      }

      // Load styles
      if (initialProjectData.styles) {
        setProjectStyles(initialProjectData.styles);
      }

      // Load project metadata
      setProjectData({
        title: initialProjectData.title || '',
        description: initialProjectData.description || '',
        tags: initialProjectData.tags || [],
        category: initialProjectData.category || '',
        toolsUsed: initialProjectData.toolsUsed || '',
        visibility: initialProjectData.visibility || 'everyone',
        coverImage: initialProjectData.coverImage || null,
        coverImagePreview: initialProjectData.coverImage || null,
        status: initialProjectData.status || 'published',
      });
    }
  }, [initialProjectData]);

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: type === 'text' ? '' : null,
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, content, textStyles = null) => {
    setBlocks(blocks.map(block => {
      if (block.id === id) {
        const updates = { content };
        if (textStyles !== null) {
          updates.textStyles = textStyles;
        }
        return { ...block, ...updates };
      }
      return block;
    }));
  };

  const deleteBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const moveBlock = (id, direction) => {
    const index = blocks.findIndex(block => block.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === blocks.length - 1)
    ) return;

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    setBlocks(newBlocks);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex -mt-4">
      <EditorCanvas 
        blocks={blocks}
        updateBlock={updateBlock}
        deleteBlock={deleteBlock}
        moveBlock={moveBlock}
        addBlock={addBlock}
        backgroundColor={previewStyles?.backgroundColor || projectStyles.backgroundColor}
        contentSpacing={previewStyles?.contentSpacing || projectStyles.contentSpacing}
      />
      <EditorSidebar 
        addBlock={addBlock} 
        projectStyles={projectStyles}
        setProjectStyles={setProjectStyles}
        setPreviewStyles={setPreviewStyles}
        projectData={projectData}
        setProjectData={setProjectData}
        blocks={blocks}
        projectId={projectId}
        setProjectId={setProjectId}
      />
    </div>
  );
};

export default ProjectEditor;
