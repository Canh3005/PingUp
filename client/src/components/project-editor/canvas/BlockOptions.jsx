import React from 'react';
import { Image, Type, Grid3x3, Video, Code, Box, Workflow, Boxes } from 'lucide-react';

const BlockOptions = ({ onSelectBlock }) => {
  const blockTypes = [
    { icon: Image, label: 'Image', type: 'image' },
    { icon: Type, label: 'Text', type: 'text' },
    { icon: Grid3x3, label: 'Photo Grid', type: 'photo-grid' },
    { icon: Video, label: 'Video', type: 'video' },
    { icon: Code, label: 'Embed', type: 'embed' },
    { icon: Box, label: 'Lightroom', type: 'lightroom' },
    { icon: Workflow, label: 'Prototype', type: 'prototype' },
    { icon: Boxes, label: '3D', type: '3d' },
  ];

  return (
    <div className="py-2">
      <div className="bg-gray-900 rounded-lg p-3 flex items-center justify-center gap-2">
        <span className="text-white text-sm font-medium mr-2">Insert Media:</span>
        {blockTypes.map((blockType) => {
          const Icon = blockType.icon;
          return (
            <button
              key={blockType.type}
              onClick={() => onSelectBlock(blockType.type)}
              className="p-2 hover:bg-gray-800 rounded transition-colors cursor-pointer group"
              title={blockType.label}
            >
              <Icon className="w-5 h-5 text-white" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BlockOptions;
