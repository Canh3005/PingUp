import React from 'react';
import { ImageOff } from 'lucide-react';

const ProjectContent = ({ project }) => {
  console.log("Rendering ProjectContent with project:", project);

  if (!project.blocks || project.blocks.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ImageOff className="w-10 h-10 text-white/30" />
        </div>
        <p className="text-white/50 font-medium">No content available</p>
        <p className="text-white/30 text-sm mt-1">This project doesn't have any content blocks yet</p>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto rounded-2xl overflow-hidden shadow-2xl"
      style={{
        backgroundColor: project.styles?.backgroundColor || '#FFFFFF',
      }}
    >
      {project.blocks
        .sort((a, b) => a.order - b.order)
        .map((block, index) => (
          <div
            key={block._id}
            className="relative"
            style={{
              marginBottom: index === project.blocks.length - 1 ? 0 : `${project.styles?.contentSpacing || 0}px`
            }}
          >
            {block.type === 'text' && (
              <div
                className="prose max-w-none px-8 py-4"
                style={{
                  fontSize: block.textStyles?.fontSize ? `${block.textStyles.fontSize}px` : '20px',
                  fontFamily: block.textStyles?.fontFamily || 'Helvetica',
                  fontWeight: block.textStyles?.isBold ? 'bold' : 'normal',
                  fontStyle: block.textStyles?.isItalic ? 'italic' : 'normal',
                  textDecoration: block.textStyles?.isUnderline ? 'underline' : 'none',
                  textAlign: block.textStyles?.textAlign || 'left',
                  color: block.textStyles?.textColor || '#000000',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  lineHeight: 1.7,
                }}
              >
                {block.content}
              </div>
            )}
            {block.type === 'image' && block.mediaUrl && (
              <div className="group relative overflow-hidden">
                <img
                  src={block.mediaUrl}
                  alt="Project content"
                  className="w-full h-auto"
                  loading="lazy"
                />
                {/* Subtle vignette effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )}
            {block.type === 'video' && block.mediaUrl && (
              <div className="relative">
                <video
                  src={block.mediaUrl}
                  controls
                  className="w-full h-auto"
                  preload="metadata"
                />
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default ProjectContent;
