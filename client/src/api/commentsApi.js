import apiClient from "./client";

export const commentsApi = {
  getCommentsByPostId: async (postId) => {
    const response = await apiClient.get(`/comments/${postId}`);
    return response.data;
  },

  createComment: async (commentData) => {
    const response = await apiClient.post("/comments", commentData);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },
};
