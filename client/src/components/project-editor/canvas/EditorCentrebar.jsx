import React from 'react';
import { Image, Type, Grid3x3, Video, Code, Box, Workflow, Boxes } from 'lucide-react';

const EditorCentrebar = ({ addBlock }) => {
  const tools = [
    { icon: Image, label: 'Image', type: 'image' },
    { icon: Type, label: 'Text', type: 'text' },
    { icon: Grid3x3, label: 'Photo Grid', type: 'photo-grid' },
    { icon: Video, label: 'Video & Audio', type: 'video' },
    { icon: Code, label: 'Embed', type: 'embed' },
    { icon: Box, label: 'Lightroom', type: 'lightroom' },
    { icon: Workflow, label: 'Prototype', type: 'prototype' },
    { icon: Boxes, label: '3D', type: '3d' },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 mt-40">
      <h2 className="text-2xl text-gray-500 mb-12">Start building your project:</h2>
      
      <div className="flex items-center gap-6 flex-wrap justify-center max-w-4xl">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.type}
              onClick={() => addBlock(tool.type)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EditorCentrebar;