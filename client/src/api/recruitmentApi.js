import httpClient from '../services/httpClient';

const recruitmentApi = {
  // Create new recruitment
  createRecruitment: (recruitmentData) => {
    return httpClient.post('/recruitments', recruitmentData);
  },

  // Get recruitment by ID
  getRecruitmentById: (recruitmentId) => {
    return httpClient.get(`/recruitments/${recruitmentId}`);
  },

  // Get recruitments by project hub
  getRecruitmentsByProjectHub: (projectHubId, status = 'all') => {
    return httpClient.get(`/recruitments/project-hub/${projectHubId}`, {
      params: { status },
    });
  },

  // Update recruitment
  updateRecruitment: (recruitmentId, updateData) => {
    return httpClient.put(`/recruitments/${recruitmentId}`, updateData);
  },

  // Close recruitment
  closeRecruitment: (recruitmentId, filledBy = null) => {
    return httpClient.patch(`/recruitments/${recruitmentId}/close`, { filledBy });
  },

  // Delete recruitment
  deleteRecruitment: (recruitmentId) => {
    return httpClient.delete(`/recruitments/${recruitmentId}`);
  },
};

export default recruitmentApi;
