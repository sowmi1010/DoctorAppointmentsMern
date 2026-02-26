import Doctor from "../models/Doctor.js";
import User from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { ROLES } from "../constants/roles.js";

export async function createDoctorProfile({ userId, specialization, experienceYears, bio, consultationFee, clinicAddress }) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role !== ROLES.DOCTOR) throw new ApiError(400, "User role must be DOCTOR");

  const existing = await Doctor.findOne({ userId });
  if (existing) throw new ApiError(409, "Doctor profile already exists");

  return Doctor.create({
    userId,
    specialization,
    experienceYears,
    bio,
    consultationFee,
    clinicAddress,
  });
}

export async function listDoctors({ q }) {
  // search by specialization or name (user)
  const doctors = await Doctor.find()
    .populate({ path: "userId", select: "name email phone role" })
    .lean();

  if (!q) return doctors;

  const query = q.toLowerCase();
  return doctors.filter((d) => {
    const name = d.userId?.name?.toLowerCase() || "";
    const spec = d.specialization?.toLowerCase() || "";
    return name.includes(query) || spec.includes(query);
  });
}

export async function getDoctorById(doctorId) {
  const doctor = await Doctor.findById(doctorId).populate({ path: "userId", select: "name email phone role" });
  if (!doctor) throw new ApiError(404, "Doctor not found");
  return doctor;
}

export async function updateDoctorProfile(doctorId, updates) {
  const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, { new: true });
  if (!doctor) throw new ApiError(404, "Doctor not found");
  return doctor;
}