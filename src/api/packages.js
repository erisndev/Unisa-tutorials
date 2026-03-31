import api from "./client";

export const PackageAPI = {
  /* ── Public ── */

  /** GET /api/packages */
  async list() {
    const { data } = await api.get("/api/packages");
    return data;
  },

  /** GET /api/packages/:id */
  async get(id) {
    const { data } = await api.get(`/api/packages/${id}`);
    return data;
  },

  /* ── Admin ── */

  /** GET /api/admin/packages */
  async adminList() {
    const { data } = await api.get("/api/admin/packages");
    return data;
  },

  /** POST /api/admin/packages */
  async create(body) {
    const { data } = await api.post("/api/admin/packages", body);
    return data;
  },

  /** PUT /api/admin/packages/:id */
  async update(id, body) {
    const { data } = await api.put(`/api/admin/packages/${id}`, body);
    return data;
  },

  /** DELETE /api/admin/packages/:id */
  async remove(id) {
    const { data } = await api.delete(`/api/admin/packages/${id}`);
    return data;
  },
};
