import api from "./apiClient";

export const adminService = {
  stats: () => api.get("/admin/stats"),
  users: () => api.get("/admin/users"),
};