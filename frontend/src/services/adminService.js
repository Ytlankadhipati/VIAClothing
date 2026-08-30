import api from "./api";

export const adminService = {
  getDashboardStats: () => api.get("/admin/dashboard"),
  getOrders: (params) => api.get("/admin/orders", { params }),
  updateOrderStatus: (orderId, statusData) => api.put(`/admin/orders/${orderId}/status`, statusData),
  getCustomers: () => api.get("/admin/customers"),
  getInventory: () => api.get("/admin/inventory"),
  updateInventory: (productId, data) => api.put(`/admin/inventory/${productId}`, data),
  getCoupons: () => api.get("/admin/coupons"),
  createCoupon: (couponData) => api.post("/admin/coupons", couponData),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
  createProduct: (productData) => api.post("/products", productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadImage: (formData) =>
    api.post("/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
};
