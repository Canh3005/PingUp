// src/api/uploadApi.js
import httpClient from "../services/httpClient";

const uploadApi = {
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const res = await httpClient.post("/upload/avatar", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  uploadCover: async (file) => {
    const formData = new FormData();
    formData.append('cover', file);
    
    const res = await httpClient.post("/upload/cover", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  uploadPortfolio: async (file) => {
    const formData = new FormData();
    formData.append('portfolio', file);
    
    const res = await httpClient.post("/upload/portfolio", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await httpClient.post("/upload/image", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('video', file);
    
    const res = await httpClient.post("/upload/video", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  deleteFile: async (publicId) => {
    const res = await httpClient.delete("/upload/file", {
      data: { publicId }
    });
    return res.data;
  }
};

export default uploadApi;
