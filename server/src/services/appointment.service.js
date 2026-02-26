import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import Slot from "../models/Slot.js";
import Doctor from "../models/Doctor.js";
import { ApiError } from "../utils/ApiError.js";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus.js";

function assertValidObjectId(value, fieldName) {
  if (!mongoose.isValidObjectId(value)) {
    throw new ApiError(400, `${fieldName} is invalid`);
  }
}

export async function bookAppointment({ patientId, doctorId, slotId, reason }) {
  assertValidObjectId(patientId, "patientId");
  assertValidObjectId(doctorId, "doctorId");
  assertValidObjectId(slotId, "slotId");

  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  // Atomic lock: only one request can flip this slot from false -> true.
  const slot = await Slot.findOneAndUpdate(
    { _id: slotId, doctorId, isBooked: false },
    { $set: { isBooked: true } },
    { new: true }
  );

  if (!slot) throw new ApiError(409, "Slot already booked or invalid");

  try {
    return await Appointment.create({
      patientId,
      doctorId,
      slotId,
      reason,
      status: APPOINTMENT_STATUS.BOOKED,
    });
  } catch (err) {
    // Existing appointment for this slot: keep slot locked and return conflict.
    if (err?.code === 11000) {
      throw new ApiError(409, "Slot already booked");
    }

    // Best-effort rollback for non-conflict failures.
    await Slot.findByIdAndUpdate(slotId, { $set: { isBooked: false } });
    throw err;
  }
}

export async function cancelAppointment({ appointmentId, userId, role }) {
  const appt = await Appointment.findById(appointmentId);
  if (!appt) throw new ApiError(404, "Appointment not found");

  // patient can cancel own appointment; admin can cancel any
  if (role !== "ADMIN" && appt.patientId.toString() !== userId.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  if (appt.status !== APPOINTMENT_STATUS.BOOKED) {
    throw new ApiError(400, "Only BOOKED appointment can be cancelled");
  }

  appt.status = APPOINTMENT_STATUS.CANCELLED;
  await appt.save();

  // free slot
  await Slot.findByIdAndUpdate(appt.slotId, { $set: { isBooked: false } });

  return appt;
}

export async function rescheduleAppointment({ appointmentId, userId, role, newSlotId }) {
  assertValidObjectId(appointmentId, "appointmentId");
  assertValidObjectId(newSlotId, "newSlotId");

  const appt = await Appointment.findById(appointmentId);
  if (!appt) throw new ApiError(404, "Appointment not found");

  if (role !== "ADMIN" && appt.patientId.toString() !== userId.toString()) {
    throw new ApiError(403, "Forbidden");
  }

  if (appt.status !== APPOINTMENT_STATUS.BOOKED) {
    throw new ApiError(400, "Only BOOKED appointment can be rescheduled");
  }

  // Book the new slot atomically
  const newSlot = await Slot.findOneAndUpdate(
    { _id: newSlotId, doctorId: appt.doctorId, isBooked: false },
    { $set: { isBooked: true } },
    { new: true }
  );
  if (!newSlot) throw new ApiError(409, "New slot already booked or invalid");

  try {
    const oldSlotId = appt.slotId;
    appt.slotId = newSlotId;
    await appt.save();
    await Slot.findByIdAndUpdate(oldSlotId, { $set: { isBooked: false } });
    return appt;
  } catch (err) {
    // Release newly locked slot if reschedule fails mid-way.
    await Slot.findByIdAndUpdate(newSlotId, { $set: { isBooked: false } });
    throw err;
  }
}

export async function listMyAppointments({ userId, role }) {
  // Patient: by patientId
  // Doctor: by doctorId (need doctor profile id)
  // Admin: all
  let filter = {};
  if (role === "PATIENT") filter.patientId = userId;
  if (role === "ADMIN") filter = {};

  const q = Appointment.find(filter)
    .populate({ path: "patientId", select: "name email phone role" })
    .populate({ path: "doctorId", populate: { path: "userId", select: "name email phone" } })
    .populate({ path: "slotId" })
    .sort({ createdAt: -1 });

  return q;
}

export async function listDoctorAppointments({ doctorId }) {
  return Appointment.find({ doctorId })
    .populate({ path: "patientId", select: "name email phone role" })
    .populate({ path: "slotId" })
    .sort({ createdAt: -1 });
}
