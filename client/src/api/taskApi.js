import httpClient from '../services/httpClient';

const taskApi = {
  // Create task
  createTask: async (taskData) => {
    const res = await httpClient.post('/tasks', taskData);
    return res.data;
  },

  // Get task by ID
  getTask: async (taskId) => {
    const res = await httpClient.get(`/tasks/${taskId}`);
    return res.data;
  },

  // Get tasks by project hub
  getTasksByProjectHub: async (projectHubId, filters = {}) => {
    const params = { ...filters };
    const res = await httpClient.get(`/tasks/project/${projectHubId}`, { params });
    return res.data;
  },

  // Get tasks by milestone
  getTasksByMilestone: async (milestoneId) => {
    const res = await httpClient.get(`/tasks/milestone/${milestoneId}`);
    return res.data;
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    const res = await httpClient.put(`/tasks/${taskId}`, taskData);
    return res.data;
  },

  // Move task to different column
  moveTask: async (taskId, newColumn, newOrder) => {
    const res = await httpClient.put(`/tasks/${taskId}/move`, { newColumn, newOrder });
    return res.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const res = await httpClient.delete(`/tasks/${taskId}`);
    return res.data;
  },

  // Assign user to task
  assignUser: async (taskId, assigneeId) => {
    const res = await httpClient.put(`/tasks/${taskId}/assign`, { assigneeId });
    return res.data;
  },

  // Unassign user from task
  unassignUser: async (taskId, assigneeId) => {
    const res = await httpClient.put(`/tasks/${taskId}/unassign`, { assigneeId });
    return res.data;
  },

  // Add attachment
  addAttachment: async (taskId, attachmentData) => {
    const res = await httpClient.post(`/tasks/${taskId}/attachments`, attachmentData);
    return res.data;
  },

  // Remove attachment
  removeAttachment: async (taskId, attachmentId) => {
    const res = await httpClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
    return res.data;
  },

  // Get task statistics
  getTaskStatistics: async (projectHubId) => {
    const res = await httpClient.get(`/tasks/project/${projectHubId}/statistics`);
    return res.data;
  },

  // Add label to task
  addLabel: async (taskId, data) => {
    const res = await httpClient.post(`/tasks/${taskId}/labels`, data);
    return res.data;
  },

  // Remove label from task
  removeLabel: async (taskId, data) => {
    const res = await httpClient.delete(`/tasks/${taskId}/labels`, { data });
    return res.data;
  },

  // Get available labels
  getAvailableLabels: async () => {
    const res = await httpClient.get('/tasks/labels/available');
    return res.data;
  },
};

export default taskApi;
