import React from "react";
import { ThumbsUp, Share2, Save, Mail, Plus } from "lucide-react";
import { useAuth } from "../../context/authContext";

const ProjectSidebar = ({ project, onLike }) => {
  const { user } = useAuth();
  const isOwnProject = user?._id === project.owner?._id;

  return (
    <div className="fixed right-60 top-30 flex flex-col items-center gap-4">
      {/* Avatar with Follow Button */}
      <div className="relative">
        <img
          src={
            project.owner?.profile?.avatarUrl || "https://via.placeholder.com/40"
          }
          alt="User"
          className="w-12 h-12 rounded-full"
        />
        {/* Follow Button - Only show if not own project */}
        {!isOwnProject && (
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
            <Plus className="w-4 h-4 text-white" />
          </button>
        )}
      </div>
      <button className="flex flex-col items-center gap-1 text-gray-600 cursor-pointer">
        <div className="border-1 p-2 rounded-full bg-white hover:text-gray-900">
          <Mail className="w-7 h-7" />
        </div>
        <span className="text-xs text-white">Message</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-600 cursor-pointer">
        <div className="border-1 p-2 rounded-full bg-white hover:text-gray-900">
          <Save className="w-7 h-7" />
        </div>
        <span className="text-xs text-white">Save</span>
      </button>
      <button className="flex flex-col items-center gap-1 text-gray-600 cursor-pointer">
        <div className="border-1 p-2 rounded-full bg-white hover:text-gray-900">
          <Share2 className="w-7 h-7" />
        </div>
        <span className="text-xs text-white">Share</span>
      </button>
      <button
        onClick={onLike}
        className="flex flex-col items-center gap-1 text-blue-600 hover:text-blue-700"
      >
        <div className="w-11 h-11 bg-blue-600 rounded-lg flex items-center justify-center cursor-pointer">
          <ThumbsUp className="w-7 h-7 text-white" />
        </div>
        <span className="text-xs">Appreciate</span>
      </button>
    </div>
  );
};

export default ProjectSidebar;
