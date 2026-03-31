import api from "./client";

export const PaymentAPI = {
  initialize: async ({ orderId, email }) => {
    const { data } = await api.post("/api/payments/initialize", { orderId, email });
    return data;
  },

  verify: async (reference) => {
    const { data } = await api.get(`/api/payments/verify/${reference}`);
    return data;
  },

  status: async (orderId) => {
    const { data } = await api.get(`/api/payments/status/${orderId}`);
    return data;
  },
};
