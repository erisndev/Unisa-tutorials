import api from "./client";

export const AuthAPI = {
  /** POST /api/admin/login */
  async login(username, password) {
    const { data } = await api.post("/api/admin/login", { username, password });
    if (data.token) {
      localStorage.setItem("admin_token", data.token);
    }
    return data;
  },

  logout() {
    localStorage.removeItem("admin_token");
  },

  getToken() {
    return localStorage.getItem("admin_token");
  },

  isLoggedIn() {
    return !!localStorage.getItem("admin_token");
  },
};
