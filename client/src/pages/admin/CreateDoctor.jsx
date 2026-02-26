import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/apiClient";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  password: "",
  specialization: "",
  experienceYears: "",
  consultationFee: "",
  clinicAddress: "",
};

const SPECIALIZATIONS = [
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Gynecology",
  "General Medicine",
];

const EXPERIENCE_OPTIONS = Array.from({ length: 31 }, (_, i) => i); // 0–30 years

const FEE_OPTIONS = [
  50, 75, 100, 120, 150, 200, 250, 300, 400, 500,
];

export default function CreateDoctor({ onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post("/admin/doctors", form);
      toast.success("Doctor created ✨");
      onSuccess?.();
      setForm(EMPTY_FORM);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">
            Create Doctor Profile
          </h2>
          <p className="text-white/60 text-sm mt-1">
            Add a new doctor with full professional details.
          </p>
        </div>

        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20">
          Doctor Onboarding
        </span>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">

        {/* Name */}
        <InputField
          label="Doctor Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Dr. Amara Hudson"
          required
        />

        {/* Email */}
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="doctor@hospital.com"
          required
        />

        {/* Phone */}
        <InputField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+1 234 567 8900"
          required
        />

        {/* Password */}
        <InputField
          label="Temporary Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Set initial password"
          required
        />

        {/* Specialization Dropdown */}
        <SelectField
          label="Specialization"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          options={SPECIALIZATIONS}
          required
        />

        {/* Experience Dropdown */}
        <SelectField
          label="Experience (Years)"
          name="experienceYears"
          value={form.experienceYears}
          onChange={handleChange}
          options={EXPERIENCE_OPTIONS.map((y) => `${y}`)}
          required
        />

        {/* Fee Dropdown */}
        <SelectField
          label="Consultation Fee ($)"
          name="consultationFee"
          value={form.consultationFee}
          onChange={handleChange}
          options={FEE_OPTIONS.map((f) => `${f}`)}
          required
        />

        {/* Clinic Address */}
        <div className="sm:col-span-2">
          <label className="text-xs uppercase tracking-[0.12em] text-white/60 font-semibold">
            Clinic Address
          </label>
          <textarea
            name="clinicAddress"
            value={form.clinicAddress}
            onChange={handleChange}
            rows={4}
            required
            className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                       focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
            placeholder="425 Maple Street, Austin, TX"
          />
        </div>

        {/* Submit */}
        <div className="sm:col-span-2 flex justify-between items-center mt-2">
          <p className="text-xs text-white/50">
            Doctor can update details later from dashboard.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl font-semibold text-zinc-950
                       bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                       hover:brightness-110 active:brightness-95 transition
                       shadow-[0_10px_30px_rgba(245,158,11,0.25)]
                       disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ------------------ Reusable Components ------------------ */

function InputField({ label, name, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.12em] text-white/60 font-semibold">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.12em] text-white/60 font-semibold">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-black">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}