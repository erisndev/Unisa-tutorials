import api from "./client";

export const OrderAPI = {
  /* ── Public ── */

  /** POST /api/orders — create order with IDs */
  async create(body) {
    const { data } = await api.post("/api/orders", body);
    return data;
  },

  /** POST /api/orders/create-with-details — fallback with embedded details */
  async createWithDetails(body) {
    const { data } = await api.post("/api/orders/create-with-details", body);
    return data;
  },

  /** GET /api/orders/verify/:reference */
  async verify(reference) {
    const { data } = await api.get(`/api/orders/verify/${reference}`);
    return data;
  },

  /* ── Admin ── */

  /** GET /api/admin/orders */
  async adminList() {
    const { data } = await api.get("/api/admin/orders");
    return data;
  },

  /** GET /api/admin/orders/:id */
  async adminGet(id) {
    const { data } = await api.get(`/api/admin/orders/${id}`);
    return data;
  },
};
