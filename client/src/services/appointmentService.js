import api from "./apiClient";

export const appointmentService = {
  book: (payload) => api.post("/appointments", payload),
  my: () => api.get("/appointments/my"),
  cancel: (id) => api.put(`/appointments/${id}/cancel`),
  reschedule: (id, newSlotId) => api.put(`/appointments/${id}/reschedule`, { newSlotId }),

  doctorMine: () => api.get("/appointments/doctor/me"),
};