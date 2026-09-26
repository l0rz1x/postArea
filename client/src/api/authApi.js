import apiClient from "./client";

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post("/auth", userData);
    return response.data;
  },

  checkAuth: async () => {
    const response = await apiClient.get("/auth/check");
    return response.data;
  },

  getUserProfile: async (userId) => {
    const response = await apiClient.get(`/auth/info/${userId}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await apiClient.put("/auth/profile", profileData);
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await apiClient.get(`/auth/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
};
