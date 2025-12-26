import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectView from './ProjectView';

const ProjectViewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // Go back to previous page
  };

  const handleProjectClick = (newProjectId) => {
    navigate(`/project/${newProjectId}`);
  };

  return (
    <ProjectView 
      projectId={projectId} 
      onClose={handleClose}
      onProjectClick={handleProjectClick}
    />
  );
};

export default ProjectViewPage;
