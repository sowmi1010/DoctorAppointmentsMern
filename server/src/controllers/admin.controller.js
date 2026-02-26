import bcrypt from "bcrypt";
import User from "../models/User.js";
import Doctor from "../models/Doctor.js";
import Slot from "../models/Slot.js";
import Appointment from "../models/Appointment.js";
import { ROLES } from "../constants/roles.js";

export const createDoctor = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      specialization,
      experienceYears,
      consultationFee,
      clinicAddress,
    } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: ROLES.DOCTOR,
    });

    const doctor = await Doctor.create({
      userId: user._id,
      specialization,
      experienceYears,
      consultationFee,
      clinicAddress,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      doctor,
    });
  } catch (err) {
    next(err);
  }
};

export const stats = async (req, res, next) => {
  try {
    const [users, doctors, slots, appointments] = await Promise.all([
      User.countDocuments(),
      Doctor.countDocuments(),
      Slot.countDocuments(),
      Appointment.countDocuments(),
    ]);

    res.json({
      ok: true,
      stats: {
        users,
        doctors,
        slots,
        appointments,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      ok: true,
      users,
    });
  } catch (err) {
    next(err);
  }
};
