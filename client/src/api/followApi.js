import httpClient from '../services/httpClient';

const followApi = {
  // Follow a user
  followUser: async (userId) => {
    const res = await httpClient.post(`/users/${userId}/follow`);
    return res.data;
  },

  // Unfollow a user
  unfollowUser: async (userId) => {
    const res = await httpClient.delete(`/users/${userId}/unfollow`);
    return res.data;
  },

  // Get followers list
  getFollowers: async (userId, page = 1, limit = 20) => {
    const params = { page, limit };
    const res = await httpClient.get(`/users/${userId}/followers`, { params });
    return res.data;
  },

  // Get following list
  getFollowing: async (userId, page = 1, limit = 20) => {
    const params = { page, limit };
    const res = await httpClient.get(`/users/${userId}/following`, { params });
    return res.data;
  },

  // Check if current user is following target user
  checkFollowStatus: async (userId) => {
    const res = await httpClient.get(`/users/${userId}/status`);
    return res.data;
  },
};

export default followApi;
