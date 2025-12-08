import { Image, Type, Grid3x3, Video, Code, Box, Workflow, Boxes, Sparkles } from 'lucide-react';

const EditorCentrebar = ({ addBlock }) => {
  const tools = [
    { icon: Image, label: 'Image', type: 'image', color: 'blue' },
    { icon: Type, label: 'Text', type: 'text', color: 'purple' },
    { icon: Grid3x3, label: 'Photo Grid', type: 'photo-grid', color: 'green' },
    { icon: Video, label: 'Video & Audio', type: 'video', color: 'red' },
    { icon: Code, label: 'Embed', type: 'embed', color: 'orange' },
    { icon: Box, label: 'Lightroom', type: 'lightroom', color: 'cyan' },
    { icon: Workflow, label: 'Prototype', type: 'prototype', color: 'pink' },
    { icon: Boxes, label: '3D', type: '3d', color: 'indigo' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 group-hover:bg-blue-100 text-blue-600',
    purple: 'bg-purple-50 group-hover:bg-purple-100 text-purple-600',
    green: 'bg-green-50 group-hover:bg-green-100 text-green-600',
    red: 'bg-red-50 group-hover:bg-red-100 text-red-600',
    orange: 'bg-orange-50 group-hover:bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-50 group-hover:bg-cyan-100 text-cyan-600',
    pink: 'bg-pink-50 group-hover:bg-pink-100 text-pink-600',
    indigo: 'bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600',
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Building Your Project</h2>
        <p className="text-gray-500">Choose a content block to begin</p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-2xl">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.type}
              onClick={() => addBlock(tool.type)}
              className="flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer group hover:bg-white hover:shadow-lg transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${colorClasses[tool.color]}`}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-sm text-gray-400 mt-8">
        You can also use the sidebar on the right to add content
      </p>
    </div>
  );
};

export default EditorCentrebar;
