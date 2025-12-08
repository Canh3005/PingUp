// src/api/authApi.js
import httpClient from "../services/httpClient";

const authApi = {
  login: async ({ email, password }) => {
    const res = await httpClient.post("/auth/login", { email, password });
    return res.data;
  },
  register: async ({ email, password, userName }) => {
    const res = await httpClient.post("/auth/register", { email, password, userName });
    return res.data;
  },
  getProfile: async () => {
    const res = await httpClient.get("/auth/profile");
    return res.data;
  },
  updateUserType: async (type) => {
    const res = await httpClient.put("/auth/update-type", { type });
    return res.data;
  },
  updateUserTopics: async (topics) => {
    const res = await httpClient.put("/auth/update-topics", { topics });
    return res.data;
  },
};

export default authApi;
