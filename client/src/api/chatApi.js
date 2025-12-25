// src/api/chatApi.js
import httpClient from "../services/httpClient";

const chatApi = {
  // Conversations
  getConversations: async ({ cursor, limit = 30 } = {}) => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', limit);
    const res = await httpClient.get(`/chat/conversations?${params}`);
    return res.data; // { ok: true, items: [...], nextCursor: ... }
  },

  createConversation: async ({ type, memberIds, title, avatar }) => {
    const res = await httpClient.post("/chat/conversations", {
      type,
      memberIds,
      title,
      avatar,
    });
    return res.data;
  },

  getConversation: async (conversationId) => {
    const res = await httpClient.get(`/chat/conversations/${conversationId}`);
    return res.data.conversation; // Extract conversation from { ok: true, conversation: {...} }
  },

  // Messages
  getMessages: async (conversationId, { cursor, limit = 50 } = {}) => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', limit);
    const res = await httpClient.get(
      `/chat/conversations/${conversationId}/messages?${params}`
    );
    return res.data; // { ok: true, items: [...], nextCursor: ... }
  },

  // Search users for chat
  searchUsers: async (query) => {
    const res = await httpClient.get(`/users/search?q=${encodeURIComponent(query)}`);
    return res.data;
  },
};

export default chatApi;
