import api from "./client";

export const ModuleAPI = {
  /* ── Public ── */

  /** GET /api/modules */
  async list() {
    const { data } = await api.get("/api/modules");
    return data;
  },

  /** GET /api/modules/:id */
  async get(id) {
    const { data } = await api.get(`/api/modules/${id}`);
    return data;
  },

  /* ── Admin ── */

  /** GET /api/admin/modules */
  async adminList() {
    const { data } = await api.get("/api/admin/modules");
    return data;
  },

  /** GET /api/admin/modules/:id */
  async adminGet(id) {
    const { data } = await api.get(`/api/admin/modules/${id}`);
    return data;
  },

  /** POST /api/admin/modules */
  async create(body) {
    const { data } = await api.post("/api/admin/modules", body);
    return data;
  },

  /** PUT /api/admin/modules/:id */
  async update(id, body) {
    const { data } = await api.put(`/api/admin/modules/${id}`, body);
    return data;
  },

  /** DELETE /api/admin/modules/:id */
  async remove(id) {
    const { data } = await api.delete(`/api/admin/modules/${id}`);
    return data;
  },
};
