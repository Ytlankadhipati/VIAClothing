import api from "./api";

export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/change-password", data),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  googleAuth: (idToken) => api.post("/auth/google", { idToken }),
  verifyEmailOtp: (otp) => api.post("/auth/verify-otp", { otp }),
  resendEmailOtp: () => api.post("/auth/resend-otp"),
  addAddress: (addressData) => api.post("/auth/addresses", addressData),
  deleteAddress: (id) => api.delete(`/auth/addresses/${id}`),
};

