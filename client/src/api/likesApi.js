import apiClient from "./client";

export const likesApi = {
  toggleLike: async (postId) => {
    const response = await apiClient.post("/like", { postId });
    return response.data;
  },
};
