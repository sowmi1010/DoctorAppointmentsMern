import api from "./apiClient";

export const doctorService = {
  list: (q = "") => api.get(`/doctors${q ? `?q=${encodeURIComponent(q)}` : ""}`),
  get: (id) => api.get(`/doctors/${id}`),

  // doctor self profile
  myProfile: () => api.get("/doctors/me/profile"),
  createProfile: (payload) => api.post("/doctors/me/profile", payload),
  updateProfile: (payload) => api.put("/doctors/me/profile", payload),
};