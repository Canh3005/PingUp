import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectHubSidebar from '../components/project-hub/ProjectHubSidebar';
import ProjectHubTopBar from '../components/project-hub/ProjectHubTopBar';
import OverviewTab from '../components/project-hub/tabs/OverviewTab';
import TasksTab from '../components/project-hub/tabs/TasksTab';
import DevlogsTab from '../components/project-hub/tabs/DevlogsTab';
import FilesTab from '../components/project-hub/tabs/FilesTab';
import RecruitmentTab from '../components/project-hub/tabs/RecruitmentTab';
import TeamTab from '../components/project-hub/tabs/TeamTab';
import SettingsTab from '../components/project-hub/tabs/SettingsTab';
import Loading from '../components/Loading';

const ProjectHub = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock project data - will be replaced with API call
  const [project, setProject] = useState({
    id: projectId || '1',
    name: 'Cosmic Explorer',
    logo: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200&h=400&fit=crop',
    description: 'An immersive space exploration game with stunning visuals and engaging gameplay mechanics.',
    visibility: 'public',
    tags: ['Game Dev', 'Unity', '3D', 'Sci-Fi'],
    progress: 68,
    totalTasks: 47,
    completedTasks: 32,
    members: [
      { id: 1, name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop', role: 'Project Lead' },
      { id: 2, name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop', role: 'UI Designer' },
      { id: 3, name: 'Mike Johnson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop', role: 'Developer' },
      { id: 4, name: 'Emily Wang', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop', role: 'Sound Designer' },
    ],
    milestones: [
      { id: 1, title: 'Alpha Release', date: '2024-02-15', status: 'completed' },
      { id: 2, title: 'Beta Testing', date: '2024-03-01', status: 'in_progress' },
      { id: 3, title: 'Final Release', date: '2024-04-15', status: 'upcoming' },
    ],
    integrations: {
      github: 'https://github.com/cosmic-explorer',
      figma: 'https://figma.com/cosmic-explorer',
      discord: 'https://discord.gg/cosmic',
    },
    createdAt: '2024-01-10',
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={project} />;
      case 'tasks':
        return <TasksTab project={project} />;
      case 'devlogs':
        return <DevlogsTab project={project} />;
      case 'files':
        return <FilesTab project={project} />;
      case 'recruitment':
        return <RecruitmentTab project={project} />;
      case 'team':
        return <TeamTab project={project} />;
      case 'settings':
        return <SettingsTab project={project} setProject={setProject} />;
      default:
        return <OverviewTab project={project} />;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        {/* Sidebar */}
        <ProjectHubSidebar
          project={project}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Main Content */}
        <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Top Bar */}
          <ProjectHubTopBar
            project={project}
            activeTab={activeTab}
          />

          {/* Tab Content */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHub;
