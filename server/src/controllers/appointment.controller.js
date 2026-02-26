import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import Doctor from "../models/Doctor.js";
import {
  bookAppointment,
  cancelAppointment,
  rescheduleAppointment,
  listMyAppointments,
  listDoctorAppointments,
} from "../services/appointment.service.js";

export const book = catchAsync(async (req, res) => {
  const { doctorId, slotId, reason } = req.body;
  if (!doctorId || !slotId) throw new ApiError(400, "doctorId and slotId required");

  const appt = await bookAppointment({
    patientId: req.user._id,
    doctorId,
    slotId,
    reason,
  });

  res.status(201).json({ ok: true, appointment: appt });
});

export const cancel = catchAsync(async (req, res) => {
  const appt = await cancelAppointment({
    appointmentId: req.params.id,
    userId: req.user._id,
    role: req.user.role,
  });

  res.json({ ok: true, appointment: appt });
});

export const reschedule = catchAsync(async (req, res) => {
  const { newSlotId } = req.body;
  if (!newSlotId) throw new ApiError(400, "newSlotId required");

  const appt = await rescheduleAppointment({
    appointmentId: req.params.id,
    userId: req.user._id,
    role: req.user.role,
    newSlotId,
  });

  res.json({ ok: true, appointment: appt });
});

export const myAppointments = catchAsync(async (req, res) => {
  const list = await listMyAppointments({ userId: req.user._id, role: req.user.role });
  res.json({ ok: true, appointments: await list });
});

export const doctorAppointments = catchAsync(async (req, res) => {
  // doctor can see own appointments
  const doc = await Doctor.findOne({ userId: req.user._id });
  if (!doc) throw new ApiError(404, "Doctor profile not found");

  const list = await listDoctorAppointments({ doctorId: doc._id });
  res.json({ ok: true, appointments: list });
});