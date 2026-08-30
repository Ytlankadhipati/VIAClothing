import api from "./api";

export const wishlistService = {
  getWishlist: () => api.get("/wishlist"),
  toggleWishlist: (productId) => api.post(`/wishlist/${productId}`),
};
