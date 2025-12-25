import httpClient from '../services/httpClient';

const projectApi = {
  // Create project
  createProject: async (projectData) => {
    const res = await httpClient.post('/projects', projectData);
    return res.data;
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    const res = await httpClient.put(`/projects/${projectId}`, projectData);
    return res.data;
  },

  // Update blocks
  updateBlocks: async (projectId, blocks) => {
    const res = await httpClient.put(`/projects/${projectId}/blocks`, { blocks });
    return res.data;
  },

  // Update styles
  updateStyles: async (projectId, styles) => {
    const res = await httpClient.put(`/projects/${projectId}/styles`, { styles });
    return res.data;
  },

  // Publish project
  publishProject: async (projectId) => {
    const res = await httpClient.post(`/projects/${projectId}/publish`);
    return res.data;
  },

  // Get project by ID
  getProject: async (projectId) => {
    const res = await httpClient.get(`/projects/${projectId}`);
    return res.data;
  },

  // Get user's projects
  getUserProjects: async (status = null) => {
    const params = status ? { status } : {};
    const res = await httpClient.get('/projects/my-projects', { params });
    return res.data;
  },

  // Get published projects (feed)
  getPublishedProjects: async (page = 1, limit = 12, filters = {}) => {
    const params = { page, limit, ...filters };
    const res = await httpClient.get('/projects/published', { params });
    return res.data;
  },

  // Get projects from followed users
  getFollowingProjects: async (page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc') => {
    const params = { page, limit, sortBy, sortOrder };
    const res = await httpClient.get('/projects/following', { params });
    return res.data;
  },

  // Get user's published projects by userId
  getUserPublishedProjects: async (userId, limit = 6, excludeProjectId = null) => {
    const params = { limit };
    if (excludeProjectId) {
      params.excludeProjectId = excludeProjectId;
    }
    const res = await httpClient.get(`/projects/user/${userId}/published`, { params });
    return res.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const res = await httpClient.delete(`/projects/${projectId}`);
    return res.data;
  },

  // Toggle like
  toggleLike: async (projectId) => {
    const res = await httpClient.post(`/projects/${projectId}/like`);
    return res.data;
  },

  // Increment view
  incrementView: async (projectId) => {
    const res = await httpClient.post(`/projects/${projectId}/view`);
    return res.data;
  },

  // Comment APIs
  addComment: async (projectId, content) => {
    const res = await httpClient.post(`/comments/${projectId}/comments`, { content });
    return res.data;
  },

  getComments: async (projectId) => {
    const res = await httpClient.get(`/comments/${projectId}/comments`);
    return res.data;
  },

  deleteComment: async (commentId) => {
    const res = await httpClient.delete(`/comments/${commentId}`);
    return res.data;
  },

  toggleCommentLike: async (commentId) => {
    const res = await httpClient.post(`/comments/${commentId}/like`);
    return res.data;
  },
};

export default projectApi;
