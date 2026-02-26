import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    date: { type: String, required: true },     // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true },   // HH:mm
    isBooked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate slot rows for same doctor/date/time
slotSchema.index({ doctorId: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

export default mongoose.model("Slot", slotSchema);