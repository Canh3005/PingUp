import React, { useState } from 'react';
import {
  Plus,
  UserPlus,
  Bell,
  Search,
  MoreHorizontal,
  FileText,
  CheckSquare,
  Share2,
  ExternalLink,
  Compass,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectHubTopBar = ({ project, activeTab }) => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const navigate = useNavigate();

  const getTabTitle = () => {
    const titles = {
      overview: 'Overview',
      tasks: 'Task Board',
      devlogs: 'Development Logs',
      files: 'Files & Assets',
      recruitment: 'Recruitment',
      team: 'Team Members',
      settings: 'Project Settings',
    };
    return titles[activeTab] || 'Overview';
  };

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-30">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Title & Breadcrumb */}
          <div className="flex items-center gap-4">
            {/* Back to Explore Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all group"
              title="Back to Explore"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <Compass className="w-5 h-5" />
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>{project.name}</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{getTabTitle()}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{getTabTitle()}</h1>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Quick Add Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Quick Add</span>
              </button>

              {showQuickAdd && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowQuickAdd(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <CheckSquare size={16} />
                      <span>New Task</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <FileText size={16} />
                      <span>New Devlog</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                      <UserPlus size={16} />
                      <span>Invite Member</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* View Project */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="View Published Project">
              <ExternalLink size={20} />
            </button>

            {/* Share */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
              <Share2 size={20} />
            </button>

            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors" title="Notifications">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* More Options */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHubTopBar;
