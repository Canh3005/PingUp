import React from 'react';
import { Image, Type, Grid3x3, Video, Code, Box, Workflow, Boxes, Plus } from 'lucide-react';

const BlockOptions = ({ onSelectBlock }) => {
  const blockTypes = [
    { icon: Image, label: 'Image', type: 'image', color: 'blue' },
    { icon: Type, label: 'Text', type: 'text', color: 'purple' },
    { icon: Grid3x3, label: 'Photo Grid', type: 'photo-grid', color: 'green' },
    { icon: Video, label: 'Video', type: 'video', color: 'red' },
    { icon: Code, label: 'Embed', type: 'embed', color: 'orange' },
    { icon: Box, label: 'Lightroom', type: 'lightroom', color: 'cyan' },
    { icon: Workflow, label: 'Prototype', type: 'prototype', color: 'pink' },
    { icon: Boxes, label: '3D', type: '3d', color: 'indigo' },
  ];

  const colorClasses = {
    blue: 'hover:bg-blue-500/20 hover:text-blue-400',
    purple: 'hover:bg-purple-500/20 hover:text-purple-400',
    green: 'hover:bg-green-500/20 hover:text-green-400',
    red: 'hover:bg-red-500/20 hover:text-red-400',
    orange: 'hover:bg-orange-500/20 hover:text-orange-400',
    cyan: 'hover:bg-cyan-500/20 hover:text-cyan-400',
    pink: 'hover:bg-pink-500/20 hover:text-pink-400',
    indigo: 'hover:bg-indigo-500/20 hover:text-indigo-400',
  };

  return (
    <div className="py-3">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-4 shadow-xl border border-gray-700/50">
        <div className="flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-gray-400 mr-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Insert Block</span>
          </div>
          <div className="h-6 w-px bg-gray-700"></div>
          <div className="flex items-center gap-1">
            {blockTypes.map((blockType) => {
              const Icon = blockType.icon;
              return (
                <button
                  key={blockType.type}
                  onClick={() => onSelectBlock(blockType.type)}
                  className={`p-2.5 rounded-xl text-gray-400 transition-all duration-200 cursor-pointer ${colorClasses[blockType.color]}`}
                  title={blockType.label}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockOptions;
