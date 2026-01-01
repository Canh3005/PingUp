import httpClient from '../services/httpClient';

const devlogApi = {
  // Create devlog
  createDevlog: async (devlogData) => {
    const res = await httpClient.post('/devlogs', devlogData);
    return res.data;
  },

  // Get devlog by ID
  getDevlog: async (devlogId) => {
    const res = await httpClient.get(`/devlogs/${devlogId}`);
    return res.data;
  },

  // Get devlogs by project hub
  getDevlogsByProjectHub: async (projectHubId, options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 10,
      visibility: options.visibility,
    };
    const res = await httpClient.get(`/devlogs/project/${projectHubId}`, { params });
    return res.data;
  },

  // Get recent devlogs
  getRecentDevlogs: async (projectHubId, limit = 3) => {
    const res = await httpClient.get(`/devlogs/project/${projectHubId}/recent`, {
      params: { limit },
    });
    return res.data;
  },

  // Get devlogs by date range
  getDevlogsByDateRange: async (projectHubId, startDate, endDate) => {
    const res = await httpClient.get(`/devlogs/project/${projectHubId}/date-range`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  // Update devlog
  updateDevlog: async (devlogId, devlogData) => {
    const res = await httpClient.put(`/devlogs/${devlogId}`, devlogData);
    return res.data;
  },

  // Delete devlog
  deleteDevlog: async (devlogId) => {
    const res = await httpClient.delete(`/devlogs/${devlogId}`);
    return res.data;
  },

  // Add reaction
  addReaction: async (devlogId, reactionType) => {
    const res = await httpClient.post(`/devlogs/${devlogId}/reactions`, { reactionType });
    return res.data;
  },

  // Remove reaction
  removeReaction: async (devlogId) => {
    const res = await httpClient.delete(`/devlogs/${devlogId}/reactions`);
    return res.data;
  },

  // Toggle pin
  togglePin: async (devlogId) => {
    const res = await httpClient.put(`/devlogs/${devlogId}/pin`);
    return res.data;
  },
};

export default devlogApi;
