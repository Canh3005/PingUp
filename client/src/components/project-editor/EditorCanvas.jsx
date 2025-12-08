import React, { useState } from 'react';
import EditorCentrebar from './canvas/EditorCentrebar';
import ImageBlock from './canvas/ImageBlock';
import TextBlock from './canvas/TextBlock';
import VideoBlock from './canvas/VideoBlock';
import BlockOptions from './canvas/BlockOptions';

const EditorCanvas = ({ blocks, updateBlock, deleteBlock, moveBlock, addBlock, backgroundColor = '#FFFFFF', contentSpacing = 60 }) => {
  const [hoveredBlockId, setHoveredBlockId] = useState(null);

  const handleAddBlockAfter = (type) => {
    setHoveredBlockId(null); // Hide immediately
    addBlock(type);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div 
        className="max-w-7xl mx-auto py-12 border-l border-gray-200 border-r min-h-screen"
        style={{ backgroundColor }}
      >
        {/* Blocks */}
        {blocks.length === 0 ? (
          <EditorCentrebar addBlock={addBlock} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: `${contentSpacing}px` }}>
            {blocks.map((block, index) => {
              const isLast = index === blocks.length - 1;
              const commonProps = {
                block,
                updateBlock,
                deleteBlock,
                moveBlock,
                isFirst: index === 0,
                isLast,
              };

              const blockElement = (() => {
                switch (block.type) {
                  case 'image':
                    return <ImageBlock key={block.id} {...commonProps} />;
                  case 'text':
                    return <TextBlock key={block.id} {...commonProps} />;
                  case 'video':
                    return <VideoBlock key={block.id} {...commonProps} />;
                  case 'photo-grid':
                    return <ImageBlock key={block.id} {...commonProps} isGrid />;
                  default:
                    return null;
                }
              })();

              return (
                <div key={block.id}>
                  {blockElement}
                  {isLast && hoveredBlockId === block.id && (
                    <div
                      className="relative"
                      onMouseLeave={() => setHoveredBlockId(null)}
                    >
                      <BlockOptions onSelectBlock={handleAddBlockAfter} />
                    </div>
                  )}
                  {isLast && hoveredBlockId !== block.id && (
                    <div
                      className="h-12"
                      onMouseEnter={() => setHoveredBlockId(block.id)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorCanvas;
