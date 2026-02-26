import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import { doctorService } from "../../services/doctorService";
import { slotService } from "../../services/slotService";
import { appointmentService } from "../../services/appointmentService";

export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [booking, setBooking] = useState("");

  const initials = useMemo(() => {
    const n = doctor?.userId?.name || "D";
    return n.trim().slice(0, 1).toUpperCase();
  }, [doctor]);

  const load = async () => {
    try {
      const d = await doctorService.get(id);
      setDoctor(d.data.doctor);

      const s = await slotService.list({ doctorId: id, date, available: true });
      setSlots(s.data.slots || []);
    } catch {
      toast.error("Failed to load doctor/slots");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const book = async (slotId) => {
    try {
      setBooking(slotId);
      await appointmentService.book({
        doctorId: id,
        slotId,
        reason: "Consultation",
      });
      toast.success("Appointment booked ✨");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setBooking("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header / Doctor card */}
        {doctor && (
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
            {/* subtle glow */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />

            <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 ring-1 ring-white/15 shadow-[0_14px_40px_rgba(245,158,11,0.25)] flex items-center justify-center">
                  <span className="text-zinc-950 font-black text-xl">
                    {initials}
                  </span>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {doctor.userId?.name}
                  </div>
                  <div className="text-white/70 mt-1">
                    {doctor.specialization}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20">
                      Fee: ₹{doctor.consultationFee}
                    </span>
                    {doctor.clinicAddress && (
                      <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white/70 bg-white/5 ring-1 ring-white/10">
                        {doctor.clinicAddress}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white/60 text-sm">Availability</div>
                <div className="text-white font-semibold">
                  Choose a date & book instantly
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Section */}
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          {/* Date selector */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
              <div className="text-white font-semibold text-lg">
                Select Date
              </div>
              <p className="text-white/60 text-sm mt-1">
                Slots update automatically.
              </p>

              <div className="mt-4">
                <label className="text-xs text-white/60">Date</label>
                <input
                  type="date"
                  className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                             focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="mt-5 rounded-2xl bg-gradient-to-r from-amber-300/10 via-amber-400/10 to-yellow-500/10 ring-1 ring-amber-400/20 p-4">
                <div className="text-amber-200 font-semibold text-sm">
                  Pro Tip ✨
                </div>
                <div className="text-white/70 text-sm mt-1">
                  Doctors usually add 30-min slots. If you don’t see any, ask the
                  doctor to create availability.
                </div>
              </div>
            </div>
          </div>

          {/* Slots grid */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-white font-semibold text-lg">
                    Available Slots
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    Tap a slot to confirm booking.
                  </div>
                </div>

                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white/70 bg-white/5 ring-1 ring-white/10">
                  {slots.length} slot(s)
                </div>
              </div>

              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((s) => (
                  <button
                    key={s._id}
                    onClick={() => book(s._id)}
                    disabled={booking === s._id}
                    className={[
                      "group text-left rounded-2xl p-4 border transition",
                      "border-white/10 bg-white/5 hover:bg-white/8 hover:border-amber-400/30",
                      "disabled:opacity-60 disabled:cursor-not-allowed",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-white font-semibold">
                        {s.startTime} – {s.endTime}
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/20">
                        Available
                      </span>
                    </div>

                    <div className="mt-2 text-white/60 text-xs">
                      Click to book instantly
                    </div>

                    <div className="mt-4 inline-flex items-center justify-center w-full rounded-xl py-2 text-sm font-semibold
                                    bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-zinc-950
                                    opacity-0 group-hover:opacity-100 transition">
                      {booking === s._id ? "Booking..." : "Book Now"}
                    </div>
                  </button>
                ))}
              </div>

              {slots.length === 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-white font-semibold">
                    No available slots for this date.
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    Try a different date, or ask the doctor to add availability.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-6 text-center text-white/50 text-xs">
          By booking, you agree to the clinic’s scheduling policy.
        </div>
      </div>
    </div>
  );
}