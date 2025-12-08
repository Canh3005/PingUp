// src/api/profileApi.js
import httpClient from "../services/httpClient";

const profileApi = {
  getProfile: async () => {
    const res = await httpClient.get("/profile");
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await httpClient.post("/profile", profileData);
    return res.data;
  },
  
  // Experience APIs
  addExperience: async (experienceData) => {
    const res = await httpClient.post("/profile/experience", experienceData);
    return res.data;
  },
  updateExperience: async (experienceId, experienceData) => {
    const res = await httpClient.put(`/profile/experience/${experienceId}`, experienceData);
    return res.data;
  },
  deleteExperience: async (experienceId) => {
    const res = await httpClient.delete(`/profile/experience/${experienceId}`);
    return res.data;
  },
  
  // Education APIs
  addEducation: async (educationData) => {
    const res = await httpClient.post("/profile/education", educationData);
    return res.data;
  },
  updateEducation: async (educationId, educationData) => {
    const res = await httpClient.put(`/profile/education/${educationId}`, educationData);
    return res.data;
  },
  deleteEducation: async (educationId) => {
    const res = await httpClient.delete(`/profile/education/${educationId}`);
    return res.data;
  },
};

export default profileApi;
