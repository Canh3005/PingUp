import React from 'react';
import { ThumbsUp, Eye, MessageCircle } from 'lucide-react';

const ProjectFooter = ({ project, onLike }) => {
  return (
    <div className="bg-black text-white max-w-7xl mx-auto py-8">
      <div className="px-6 text-center">
        {/* Like button */}
        <button 
          onClick={onLike}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-blue-700 transition-colors"
        >
          <ThumbsUp className="w-8 h-8" />
        </button>

        {/* Project title */}
        <h1 className="text-4xl font-bold mb-6">{project.title}</h1>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{project.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            <span>{project.views || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>0</span>
          </div>
        </div>

        {/* Published date */}
        <p className="text-sm text-gray-400">
          Published: {project.publishedAt ? new Date(project.publishedAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) : 'Not published'}
        </p>
      </div>
    </div>
  );
};

export default ProjectFooter;
