import { catchAsync } from "../utils/catchAsync.js";
import { ApiError } from "../utils/ApiError.js";
import Doctor from "../models/Doctor.js";
import { createDoctorProfile, listDoctors, getDoctorById, updateDoctorProfile } from "../services/doctor.service.js";

export const createProfile = catchAsync(async (req, res) => {
  // doctor creates own profile
  const { specialization, experienceYears, bio, consultationFee, clinicAddress } = req.body;
  if (!specialization) throw new ApiError(400, "specialization required");

  const doctor = await createDoctorProfile({
    userId: req.user._id,
    specialization,
    experienceYears,
    bio,
    consultationFee,
    clinicAddress,
  });

  res.status(201).json({ ok: true, doctor });
});

export const getMyDoctorProfile = catchAsync(async (req, res) => {
  const doc = await Doctor.findOne({ userId: req.user._id }).populate({ path: "userId", select: "name email phone role" });
  if (!doc) throw new ApiError(404, "Doctor profile not found");
  res.json({ ok: true, doctor: doc });
});

export const updateMyDoctorProfile = catchAsync(async (req, res) => {
  const doc = await Doctor.findOne({ userId: req.user._id });
  if (!doc) throw new ApiError(404, "Doctor profile not found");

  const updated = await updateDoctorProfile(doc._id, req.body);
  res.json({ ok: true, doctor: updated });
});

export const list = catchAsync(async (req, res) => {
  const doctors = await listDoctors({ q: req.query.q });
  res.json({ ok: true, doctors });
});

export const getOne = catchAsync(async (req, res) => {
  const doctor = await getDoctorById(req.params.id);
  res.json({ ok: true, doctor });
});