import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectHubSidebar from '../components/project-hub/ProjectHubSidebar';
import ProjectHubTopBar from '../components/project-hub/ProjectHubTopBar';
import OverviewTab from '../components/project-hub/overview/OverviewTab';
import TasksTab from '../components/project-hub/tasks/TasksTab';
import DevlogsTab from '../components/project-hub/devlogs/DevlogsTab';
import MilestonesTab from '../components/project-hub/milestones/MilestonesTab';
import FilesTab from '../components/project-hub/files/FilesTab';
import RecruitmentTab from '../components/project-hub/recruitment/RecruitmentTab';
import TeamTab from '../components/project-hub/team/TeamTab';
import SettingsTab from '../components/project-hub/settings/SettingsTab';
import Loading from '../components/Loading';
import projectHubApi from '../api/projectHubApi';
import milestoneApi from '../api/milestoneApi';
import useProjectHubPermissions from '../hooks/useProjectHubPermissions';
import AccessDenied from '../components/project-hub/AccessDenied';

const ProjectHub = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [error, setError] = useState('');
  
  const { isOwner } = useProjectHubPermissions(project);

  // Load project hub data
  useEffect(() => {
    if (projectId) {
      loadProjectHub();
    }
  }, [projectId]);

  const loadProjectHub = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch project hub data
      const response = await projectHubApi.getProjectHub(projectId);
      const hubData = response.data;
      console.log('Fetched project hub data:', hubData);
      setProject(hubData);

      // Fetch milestones for this project hub
      if (hubData._id) {
        const milestonesResponse = await milestoneApi.getMilestonesByProject(hubData._id);
        // API returns { success: true, data: [...] }
        const milestonesData = milestonesResponse.data || milestonesResponse;
        setMilestones(Array.isArray(milestonesData) ? milestonesData : []);
      }
    } catch (error) {
      console.error('Error loading project hub:', error);
      
      // Handle different error types
      if (error.response?.status === 403) {
        setError('access_denied');
      } else if (error.response?.status === 404) {
        setError('not_found');
      } else {
        setError(error.response?.data?.message || 'Failed to load project hub');
      }
      
      // Don't redirect immediately, let user see the error message
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab project={project} milestones={milestones} />;
      case 'tasks':
        return <TasksTab project={project} />;
      case 'devlogs':
        return <DevlogsTab project={project} />;
      case 'milestones':
        return <MilestonesTab project={project} />;
      case 'files':
        return <FilesTab project={project} />;
      case 'recruitment':
        return <RecruitmentTab project={project} />;
      case 'team':
        return <TeamTab project={project} onRefresh={loadProjectHub} />;
      case 'settings':
        return isOwner ? <SettingsTab project={project} setProject={setProject} /> : <OverviewTab project={project} milestones={milestones} />;
      default:
        return <OverviewTab project={project} milestones={milestones} />;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  // Handle access denied (403)
  if (error === 'access_denied') {
    return <AccessDenied projectName={project?.name} />;
  }

  // Handle not found (404) and other errors
  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Project Hub</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
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
          isOwner={isOwner}
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
