import api from "./api";

export const cartService = {
  getCart: () => api.get("/cart"),
  addToCart: (itemData) => api.post("/cart/items", itemData),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeCartItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete("/cart"),
  mergeGuestCart: (guestItems) => api.post("/cart/merge", { guestItems }),
  validateCoupon: (code, orderAmount) => api.post("/coupons/validate", { code, orderAmount }),
};
