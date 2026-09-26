import apiClient from "./client";

export const postsApi = {
  getAllPosts: async (feed = "explore") => {
    const response = await apiClient.get(`/posts?feed=${feed}`);
    return response.data;
  },

  getPostById: async (id) => {
    const response = await apiClient.get(`/posts/byId/${id}`);
    return response.data;
  },

  getPostsByUserId: async (userId) => {
    const response = await apiClient.get(`/posts/byuserId/${userId}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await apiClient.post("/posts", postData);
    return response.data;
  },

  deletePost: async (postId) => {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  },
};
