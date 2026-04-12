import { api } from "./api";

export const commentService = {
  getComments: (productId) => api.get(`/comments/product/${productId}`),
  submitComment: (commentData) => api.post(`/comments`, commentData),
  getAllCommentsForAdmin: () => api.get(`/comments/admin/all`),
  updateCommentStatus: (id, status) => api.put(`/comments/admin/${id}/status`, { status }),
};