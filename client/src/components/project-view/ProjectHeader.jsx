import React from 'react';

const ProjectHeader = ({ project }) => {
  return (
    <div className="max-w-7xl mx-auto px-3 py-4">
      <div className="flex items-center gap-3">
        <img
          src={project.owner?.profile?.avatarUrl || 'https://via.placeholder.com/40'}
          alt={project.owner?.profile?.name || 'User'}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h2 className="font-bold text-white text-xl">{project.title}</h2>
          <p className="text-md text-white">
            {project.owner?.profile?.name || 'Unknown'} • Edit Project
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
