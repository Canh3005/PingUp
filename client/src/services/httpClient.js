import axios from "axios";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// A separate instance for refresh calls to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: httpClient.defaults.baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token on every request if available
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token refresh coordination
let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) {
      reject(error);
    } else {
      // Update header for the pending request with the new token
      originalRequest.headers.Authorization = `Bearer ${token}`;
      resolve(httpClient(originalRequest));
    }
  });
  pendingQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error?.response?.status;

    // If it's not 401, just reject
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Avoid infinite loop: do not try to refresh if the request is refresh endpoint
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // No refresh token => reject and optionally clean up
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    // Mark the request as retried
    originalRequest._retry = true;

    // If a refresh is already in progress, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, originalRequest });
      });
    }

    // Start refresh flow
    isRefreshing = true;
    try {
      const { data } = await refreshClient.post("/auth/refresh-token", {
        token: refreshToken,
      });
      const newAccessToken = data?.accessToken;
      if (!newAccessToken) {
        throw new Error("No access token returned from refresh");
      }

      // Save and set default header
      localStorage.setItem("auth_token", newAccessToken);
      httpClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${newAccessToken}`;

      // Retry all queued requests
      processQueue(null, newAccessToken);

      // Retry the original request
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return httpClient(originalRequest);
    } catch (refreshErr) {
      // On refresh failure: clear tokens and fail all queued requests
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      processQueue(refreshErr, null);
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default httpClient;
