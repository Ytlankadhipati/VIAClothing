import api from "./api";

export const orderService = {
  getMyOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};
