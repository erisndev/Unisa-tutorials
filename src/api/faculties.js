import api from "./client";

export const FacultyAPI = {
  /* ── Public ── */

  /** GET /api/faculties */
  async list() {
    const { data } = await api.get("/api/faculties");
    return data;
  },

  /** GET /api/faculties/:id */
  async get(id) {
    const { data } = await api.get(`/api/faculties/${id}`);
    return data;
  },

  /** GET /api/faculties/:id/courses — active courses for a faculty */
  async listCourses(facultyId) {
    const { data } = await api.get(`/api/faculties/${facultyId}/courses`);
    return data;
  },

  /* ── Admin ── */

  /** GET /api/admin/faculties */
  async adminList() {
    const { data } = await api.get("/api/admin/faculties");
    return data;
  },

  /** GET /api/admin/faculties/:id */
  async adminGet(id) {
    const { data } = await api.get(`/api/admin/faculties/${id}`);
    return data;
  },

  /** POST /api/admin/faculties */
  async create(body) {
    const { data } = await api.post("/api/admin/faculties", body);
    return data;
  },

  /** PUT /api/admin/faculties/:id */
  async update(id, body) {
    const { data } = await api.put(`/api/admin/faculties/${id}`, body);
    return data;
  },

  /** DELETE /api/admin/faculties/:id */
  async remove(id) {
    const { data } = await api.delete(`/api/admin/faculties/${id}`);
    return data;
  },
};
