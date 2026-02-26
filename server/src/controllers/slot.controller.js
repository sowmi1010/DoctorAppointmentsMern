import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import Doctor from "../models/Doctor.js";
import { createSlot, getSlots, deleteSlot } from "../services/slot.service.js";

export const create = catchAsync(async (req, res) => {
  const { date, startTime, endTime } = req.body;
  if (!date || !startTime || !endTime) throw new ApiError(400, "date, startTime, endTime required");

  const doc = await Doctor.findOne({ userId: req.user._id });
  if (!doc) throw new ApiError(404, "Doctor profile not found");

  const slot = await createSlot({ doctorId: doc._id, date, startTime, endTime });
  res.status(201).json({ ok: true, slot });
});

export const list = catchAsync(async (req, res) => {
  const { doctorId, date, available } = req.query;
  const onlyAvailable = String(available) === "true";
  const slots = await getSlots({ doctorId, date, onlyAvailable });
  res.json({ ok: true, slots });
});

export const remove = catchAsync(async (req, res) => {
  const doc = await Doctor.findOne({ userId: req.user._id });
  if (!doc) throw new ApiError(404, "Doctor profile not found");

  await deleteSlot(req.params.id, doc._id);
  res.json({ ok: true, message: "Slot deleted" });
});