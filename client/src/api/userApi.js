import httpClient from "../services/httpClient";

const userApi = {
  // Discover users for People grid
  discoverUsers: async (page = 1, limit = 12) => {
    const res = await httpClient.get('/users/discover', {
      params: { page, limit }
    });
    return res.data;
  },

  // Search users
  searchUsers: async (query) => {
    const res = await httpClient.get('/users/search', {
      params: { q: query }
    });
    return res.data;
  },

  // Follow/Unfollow
  followUser: async (userId) => {
    const res = await httpClient.post(`/users/${userId}/follow`);
    return res.data;
  },

  unfollowUser: async (userId) => {
    const res = await httpClient.delete(`/users/${userId}/unfollow`);
    return res.data;
  },

  // Get followers/following
  getFollowers: async (userId, page = 1, limit = 20) => {
    const res = await httpClient.get(`/users/${userId}/followers`, {
      params: { page, limit }
    });
    return res.data;
  },

  getFollowing: async (userId, page = 1, limit = 20) => {
    const res = await httpClient.get(`/users/${userId}/following`, {
      params: { page, limit }
    });
    return res.data;
  },

  // Check follow status
  checkFollowStatus: async (userId) => {
    const res = await httpClient.get(`/users/${userId}/status`);
    return res.data;
  },
};

export default userApi;
