import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import projectApi from '../api/projectApi';
import ProjectEditor from './ProjectEditor';
import Loading from '../components/Loading';

const EditProjectPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        const response = await projectApi.getProject(projectId);
        setProjectData(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <ProjectEditor initialProjectData={projectData} />;
};

export default EditProjectPage;
