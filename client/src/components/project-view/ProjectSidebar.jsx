import React, { useState } from "react";
import { Heart, Share2, Bookmark, MessageCircle, Plus, Check } from "lucide-react";
import { useAuth } from "../../context/authContext";

const ProjectSidebar = ({ project, onLike }) => {
  const { user } = useAuth();
  const isOwnProject = user?._id === project.owner?._id;
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(project.likes?.includes(user?._id));

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike();
  };

  return (
    <div className="fixed right-16 xl:right-32 top-1/3 flex flex-col items-center gap-3 z-40">
      {/* Avatar with Follow Button */}
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img
          src={project.owner?.profile?.avatarUrl || project.owner?.imageUrl || "https://via.placeholder.com/40"}
          alt="User"
          className="relative w-12 h-12 rounded-2xl object-cover ring-2 ring-white/20 group-hover:ring-blue-400/50 transition-all"
        />
        {!isOwnProject && (
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center transition-all shadow-lg ${
              isFollowing
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isFollowing ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-1"></div>

      {/* Action Buttons */}
      <button
        onClick={handleLike}
        className="group flex flex-col items-center gap-1.5 cursor-pointer"
      >
        <div className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg ${
          isLiked
            ? 'bg-red-500 shadow-red-500/30'
            : 'bg-white/10 hover:bg-white/20 border border-white/10'
        }`}>
          <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${
            isLiked ? 'text-white fill-white' : 'text-white'
          }`} />
        </div>
        <span className="text-xs text-white/70 font-medium">
          {project.likes?.length || 0}
        </span>
      </button>

      <button className="group flex flex-col items-center gap-1.5 cursor-pointer">
        <div className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all border border-white/10 shadow-lg">
          <MessageCircle className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
        </div>
        <span className="text-xs text-white/70 font-medium">Comment</span>
      </button>

      <button
        onClick={() => setIsSaved(!isSaved)}
        className="group flex flex-col items-center gap-1.5 cursor-pointer"
      >
        <div className={`p-3 rounded-2xl backdrop-blur-md transition-all shadow-lg ${
          isSaved
            ? 'bg-yellow-500 shadow-yellow-500/30'
            : 'bg-white/10 hover:bg-white/20 border border-white/10'
        }`}>
          <Bookmark className={`w-5 h-5 transition-transform group-hover:scale-110 ${
            isSaved ? 'text-white fill-white' : 'text-white'
          }`} />
        </div>
        <span className="text-xs text-white/70 font-medium">Save</span>
      </button>

      <button className="group flex flex-col items-center gap-1.5 cursor-pointer">
        <div className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl transition-all border border-white/10 shadow-lg">
          <Share2 className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
        </div>
        <span className="text-xs text-white/70 font-medium">Share</span>
      </button>
    </div>
  );
};

export default ProjectSidebar;
