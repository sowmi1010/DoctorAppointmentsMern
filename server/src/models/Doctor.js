import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, required: true, trim: true },
    experienceYears: { type: Number, default: 0, min: 0 },
    bio: { type: String, trim: true, default: "" },
    consultationFee: { type: Number, default: 0, min: 0 },
    clinicAddress: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", doctorSchema);