import React, { useState } from 'react';
import { Heart, Eye, MessageCircle, Calendar, Share2, Bookmark } from 'lucide-react';

const ProjectFooter = ({ project, onLike }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike();
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count || 0;
  };

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 text-white max-w-7xl mx-auto py-12">
      <div className="px-6 text-center">
        {/* Like button with animation */}
        <div className="relative inline-block mb-8">
          <div className={`absolute inset-0 rounded-2xl blur-xl transition-all duration-300 ${
            isLiked ? 'bg-red-500/40' : 'bg-blue-500/20'
          }`}></div>
          <button
            onClick={handleLike}
            className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
              isLiked
                ? 'bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/30'
                : 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30'
            }`}
          >
            <Heart className={`w-7 h-7 transition-transform ${isLiked ? 'fill-white scale-110' : ''}`} />
          </button>
        </div>

        {/* Project title */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
          {project.title}
        </h1>

        {/* Description if exists */}
        {project.description && (
          <p className="text-white/60 max-w-2xl mx-auto mb-6 leading-relaxed">
            {project.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="font-semibold">{formatCount(project.likes?.length)}</span>
            <span className="text-white/50 text-sm">Likes</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="font-semibold">{formatCount(project.views)}</span>
            <span className="text-white/50 text-sm">Views</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
            <MessageCircle className="w-4 h-4 text-green-400" />
            <span className="font-semibold">0</span>
            <span className="text-white/50 text-sm">Comments</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">
            <Share2 className="w-4 h-4" />
            <span className="font-medium">Share</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">
            <Bookmark className="w-4 h-4" />
            <span className="font-medium">Save</span>
          </button>
        </div>

        {/* Published date */}
        <div className="flex items-center justify-center gap-2 text-white/40">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            Published {project.publishedAt ? new Date(project.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Not published'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectFooter;
