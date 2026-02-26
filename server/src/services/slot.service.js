import Slot from "../models/Slot.js";
import Doctor from "../models/Doctor.js";
import { ApiError } from "../utils/ApiError.js";
import { toISODateOnly } from "../utils/dateTime.js";

export async function createSlot({ doctorId, date, startTime, endTime }) {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw new ApiError(404, "Doctor not found");

  const d = toISODateOnly(date);

  return Slot.create({
    doctorId,
    date: d,
    startTime,
    endTime,
    isBooked: false,
  });
}

export async function getSlots({ doctorId, date, onlyAvailable = false }) {
  const filter = {};
  if (doctorId) filter.doctorId = doctorId;
  if (date) filter.date = toISODateOnly(date);
  if (onlyAvailable) filter.isBooked = false;

  return Slot.find(filter).sort({ date: 1, startTime: 1 });
}

export async function deleteSlot(slotId, doctorId) {
  const slot = await Slot.findOne({ _id: slotId, doctorId });
  if (!slot) throw new ApiError(404, "Slot not found");
  if (slot.isBooked) throw new ApiError(400, "Cannot delete a booked slot");
  await slot.deleteOne();
  return true;
}