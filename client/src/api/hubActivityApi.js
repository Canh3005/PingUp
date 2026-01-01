import httpClient from '../services/httpClient';

const hubActivityApi = {
  // Get recent activities
  getRecentActivities: async (projectHubId, limit = 20) => {
    const res = await httpClient.get(`/hub-activities/project/${projectHubId}/recent`, {
      params: { limit },
    });
    return res.data;
  },

  // Get activities with pagination
  getActivities: async (projectHubId, options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 20,
      activityType: options.activityType,
      userId: options.userId,
    };
    const res = await httpClient.get(`/hub-activities/project/${projectHubId}`, { params });
    return res.data;
  },

  // Get activities by type
  getActivitiesByType: async (projectHubId, activityType, limit = 20) => {
    const res = await httpClient.get(
      `/hub-activities/project/${projectHubId}/type/${activityType}`,
      { params: { limit } }
    );
    return res.data;
  },

  // Get user activities
  getUserActivities: async (projectHubId, userId, limit = 20) => {
    const res = await httpClient.get(
      `/hub-activities/project/${projectHubId}/user/${userId}`,
      { params: { limit } }
    );
    return res.data;
  },

  // Get timeline
  getTimeline: async (projectHubId, limit = 50) => {
    const res = await httpClient.get(`/hub-activities/project/${projectHubId}/timeline`, {
      params: { limit },
    });
    return res.data;
  },

  // Get activity statistics
  getActivityStatistics: async (projectHubId, days = 7) => {
    const res = await httpClient.get(`/hub-activities/project/${projectHubId}/statistics`, {
      params: { days },
    });
    return res.data;
  },
};

export default hubActivityApi;
