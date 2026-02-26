import mongoose from "mongoose";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus.js";

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
    status: { type: String, enum: Object.values(APPOINTMENT_STATUS), default: APPOINTMENT_STATUS.BOOKED },
    reason: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// One appointment per slot (ensures no double booking)
appointmentSchema.index({ slotId: 1 }, { unique: true });

export default mongoose.model("Appointment", appointmentSchema);