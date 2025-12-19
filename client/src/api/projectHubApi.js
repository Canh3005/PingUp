import httpClient from '../services/httpClient';

const projectHubApi = {
  // Create project hub
  createProjectHub: async (hubData) => {
    const res = await httpClient.post('/project-hubs', hubData);
    return res.data;
  },

  // Get project hub by ID
  getProjectHub: async (hubId) => {
    const res = await httpClient.get(`/project-hubs/${hubId}`);
    return res.data;
  },

  // Get user's project hubs
  getUserProjectHubs: async () => {
    const res = await httpClient.get('/project-hubs/my-hubs');
    return res.data;
  },

  // Get all project hubs
  getAllProjectHubs: async (page = 1, limit = 10, tags = null) => {
    const params = { page, limit };
    if (tags) params.tags = tags;
    const res = await httpClient.get('/project-hubs', { params });
    return res.data;
  },

  // Update project hub
  updateProjectHub: async (hubId, hubData) => {
    const res = await httpClient.put(`/project-hubs/${hubId}`, hubData);
    return res.data;
  },

  // Delete project hub
  deleteProjectHub: async (hubId) => {
    const res = await httpClient.delete(`/project-hubs/${hubId}`);
    return res.data;
  },

  // Add member
  addMember: async (hubId, memberId, role) => {
    const res = await httpClient.post(`/project-hubs/${hubId}/members`, { memberId, role });
    return res.data;
  },

  // Remove member
  removeMember: async (hubId, userId) => {
    const res = await httpClient.delete(`/project-hubs/${hubId}/members/${userId}`);
    return res.data;
  },

  // Update member role
  updateMemberRole: async (hubId, userId, role) => {
    const res = await httpClient.put(`/project-hubs/${hubId}/members/${userId}`, { role });
    return res.data;
  },

  // Link showcase project
  linkShowcaseProject: async (hubId, showcaseProjectId) => {
    const res = await httpClient.put(`/project-hubs/${hubId}/showcase`, { showcaseProjectId });
    return res.data;
  },

  // Update integrations
  updateIntegrations: async (hubId, integrations) => {
    const res = await httpClient.put(`/project-hubs/${hubId}/integrations`, { integrations });
    return res.data;
  },
};

export default projectHubApi;
