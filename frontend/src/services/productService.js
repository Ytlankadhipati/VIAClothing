import api from "./api";

export const productService = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getProductByIdOrSlug: (idOrSlug) => api.get(`/products/${idOrSlug}`),
  getCategories: () => api.get("/categories"),
  getCollections: () => api.get("/collections"),
  getProductReviews: (productId) => api.get(`/products/${productId}/reviews`),
  submitReview: (productId, reviewData) => api.post(`/products/${productId}/reviews`, reviewData),
};
