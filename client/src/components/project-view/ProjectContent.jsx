import React from 'react';

const ProjectContent = ({ project }) => {
  console.log("Rendering ProjectContent with project:", project);
  if (!project.blocks || project.blocks.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No content available
      </div>
    );
  }

  return (
    <div 
      className="max-w-7xl mx-auto"
      style={{ 
        backgroundColor: project.styles?.backgroundColor || '#FFFFFF',
      }}
    >
      {project.blocks
        .sort((a, b) => a.order - b.order)
        .map((block, index) => (
          <div 
            key={block._id}
            style={{ 
              marginBottom: index === project.blocks.length - 1 ? 0 : `${project.styles?.contentSpacing}px` 
            }}
          >
            {block.type === 'text' && (
              <div 
                className="prose max-w-none px-6"
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
                }}
              >
                {block.content}
              </div>
            )}
            {block.type === 'image' && block.mediaUrl && (
              <img 
                src={block.mediaUrl} 
                alt="Project content" 
                className="w-full h-auto"
              />
            )}
            {block.type === 'video' && block.mediaUrl && (
              <video 
                src={block.mediaUrl} 
                controls 
                className="w-full h-auto"
              />
            )}
          </div>
        ))}
    </div>
  );
};

export default ProjectContent;
