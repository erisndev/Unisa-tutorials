import api from "./client";

export const CourseAPI = {
  /* ── Public ── */

  /** GET /api/courses */
  async list() {
    const { data } = await api.get("/api/courses");
    return data;
  },

  /** GET /api/courses/:id */
  async get(id) {
    const { data } = await api.get(`/api/courses/${id}`);
    return data;
  },

  /** GET /api/courses/:id/modules — active modules for a course */
  async listModules(courseId) {
    const { data } = await api.get(`/api/courses/${courseId}/modules`);
    return data;
  },

  /* ── Admin ── */

  /** GET /api/admin/courses */
  async adminList() {
    const { data } = await api.get("/api/admin/courses");
    return data;
  },

  /** GET /api/admin/courses/:id */
  async adminGet(id) {
    const { data } = await api.get(`/api/admin/courses/${id}`);
    return data;
  },

  /** POST /api/admin/courses */
  async create(body) {
    const { data } = await api.post("/api/admin/courses", body);
    return data;
  },

  /** PUT /api/admin/courses/:id */
  async update(id, body) {
    const { data } = await api.put(`/api/admin/courses/${id}`, body);
    return data;
  },

  /** DELETE /api/admin/courses/:id */
  async remove(id) {
    const { data } = await api.delete(`/api/admin/courses/${id}`);
    return data;
  },
};
