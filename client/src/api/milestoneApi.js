import httpClient from '../services/httpClient';

const milestoneApi = {
  // Create milestone
  createMilestone: async (milestoneData) => {
    const res = await httpClient.post('/milestones', milestoneData);
    return res.data;
  },

  // Get milestone by ID
  getMilestone: async (milestoneId) => {
    const res = await httpClient.get(`/milestones/${milestoneId}`);
    return res.data;
  },

  // Get milestones by project hub ID
  getMilestonesByProject: async (hubId, status = null) => {
    const params = status ? { status } : {};
    const res = await httpClient.get(`/milestones/project/${hubId}`, { params });
    return res.data;
  },

  // Update milestone
  updateMilestone: async (milestoneId, milestoneData) => {
    const res = await httpClient.put(`/milestones/${milestoneId}`, milestoneData);
    return res.data;
  },

  // Update milestone status
  updateMilestoneStatus: async (milestoneId, status) => {
    const res = await httpClient.put(`/milestones/${milestoneId}/status`, { status });
    return res.data;
  },

  // Delete milestone
  deleteMilestone: async (milestoneId) => {
    const res = await httpClient.delete(`/milestones/${milestoneId}`);
    return res.data;
  },
};

export default milestoneApi;
