import apiClient from "./client";

export const followApi = {
  toggleFollow: async (userId) => {
    const response = await apiClient.post(`/follow/${userId}`);
    return response.data;
  },

  getFollowStatus: async (userId) => {
    const response = await apiClient.get(`/follow/status/${userId}`);
    return response.data;
  },

  getFollowers: async (userId) => {
    const response = await apiClient.get(`/follow/followers/${userId}`);
    return response.data;
  },

  getFollowing: async (userId) => {
    const response = await apiClient.get(`/follow/following/${userId}`);
    return response.data;
  },
};
