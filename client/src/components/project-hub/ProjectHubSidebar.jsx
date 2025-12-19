import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  FileText,
  FolderOpen,
  Users,
  UserPlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const ProjectHubSidebar = ({ project, activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'devlogs', label: 'Devlogs', icon: FileText },
    { id: 'files', label: 'Files', icon: FolderOpen },
    { id: 'recruitment', label: 'Recruitment', icon: UserPlus },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Project Header */}
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src={project.logo}
            alt={project.name}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-white truncate">{project.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                project.invisibility === 'public'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {project.invisibility}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 flex-1">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Links */}
      {!collapsed && project.integrations && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Integrations</p>
          <div className="space-y-2">
            {project.integrations.github && (
              <a
                href={project.integrations.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                <span>GitHub</span>
              </a>
            )}
            {project.integrations.figma && (
              <a
                href={project.integrations.figma}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                <span>Figma</span>
              </a>
            )}
            {project.integrations.discord && (
              <a
                href={project.integrations.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                <span>Discord</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-600 transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  );
};

export default ProjectHubSidebar;
