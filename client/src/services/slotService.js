import api from "./apiClient";

export const slotService = {
  list: ({ doctorId, date, available = true }) => {
    const params = new URLSearchParams();
    if (doctorId) params.append("doctorId", doctorId);
    if (date) params.append("date", date);
    params.append("available", String(available));
    return api.get(`/slots?${params.toString()}`);
  },

  create: (payload) => api.post("/slots", payload),
  remove: (slotId) => api.delete(`/slots/${slotId}`),
};