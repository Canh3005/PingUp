import httpClient from '../services/httpClient';

const applicationApi = {
  // Create new application
  createApplication: (applicationData) => {
    return httpClient.post('/applications', applicationData);
  },

  // Get application by ID
  getApplicationById: (applicationId) => {
    return httpClient.get(`/applications/${applicationId}`);
  },

  // Get applications by recruitment
  getApplicationsByRecruitment: (recruitmentId, status = 'all') => {
    return httpClient.get(`/applications/recruitment/${recruitmentId}`, {
      params: { status },
    });
  },

  // Get application stats
  getApplicationStats: (recruitmentId) => {
    return httpClient.get(`/applications/recruitment/${recruitmentId}/stats`);
  },

  // Get user's own applications
  getMyApplications: () => {
    return httpClient.get('/applications/my-applications');
  },

  // Update application status (for reviewers)
  updateApplicationStatus: (applicationId, status, reviewNotes = '') => {
    return httpClient.patch(`/applications/${applicationId}/status`, {
      status,
      reviewNotes,
    });
  },

  // Withdraw application (for applicants)
  withdrawApplication: (applicationId) => {
    return httpClient.delete(`/applications/${applicationId}`);
  },
};

export default applicationApi;
