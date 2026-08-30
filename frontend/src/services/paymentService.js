import api from "./api";

export const paymentService = {
  createRazorpayOrder: (orderPayload) => api.post("/payments/create-order", orderPayload),
  verifyPayment: (verificationPayload) => api.post("/payments/verify", verificationPayload),
};
