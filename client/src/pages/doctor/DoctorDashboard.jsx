import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import { doctorService } from "../../services/doctorService";
import { slotService } from "../../services/slotService";
import { appointmentService } from "../../services/appointmentService";

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  // slot form
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("10:30");

  const initials = useMemo(() => {
    const n = doctor?.userId?.name || "D";
    return n.trim().slice(0, 1).toUpperCase();
  }, [doctor]);

  const load = async () => {
    try {
      const prof = await doctorService.myProfile();
      setDoctor(prof.data.doctor);

      const s = await slotService.list({
        doctorId: prof.data.doctor._id,
        date,
        available: false,
      });
      setSlots(s.data.slots || []);

      const ap = await appointmentService.doctorMine();
      setAppointments(ap.data.appointments || []);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load doctor dashboard";
      toast.error(msg);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const createSlot = async (e) => {
    e.preventDefault();
    try {
      await slotService.create({ date, startTime, endTime });
      toast.success("Slot created ✨");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Slot create failed");
    }
  };

  const deleteSlot = async (slotId) => {
    try {
      await slotService.remove(slotId);
      toast.success("Slot deleted");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const statusBadge = (status) => {
    if (status === "BOOKED")
      return "text-emerald-200 bg-emerald-500/10 ring-1 ring-emerald-400/20";
    if (status === "CANCELLED")
      return "text-red-200 bg-red-500/10 ring-1 ring-red-400/20";
    if (status === "COMPLETED")
      return "text-sky-200 bg-sky-500/10 ring-1 ring-sky-400/20";
    return "text-white/70 bg-white/5 ring-1 ring-white/10";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 ring-1 ring-white/15 shadow-[0_14px_40px_rgba(245,158,11,0.25)] flex items-center justify-center">
                <span className="text-zinc-950 font-black text-xl">{initials}</span>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Doctor Dashboard
                </div>
                {doctor && (
                  <div className="text-white/65 text-sm mt-1">
                    {doctor.userId?.name} • {doctor.specialization}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20">
                Slots: {slots.length}
              </span>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white/70 bg-white/5 ring-1 ring-white/10">
                Appointments: {appointments.length}
              </span>
            </div>
          </div>
        </div>

        {/* Create Slot + Slots List */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Slot */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
              <div className="text-white font-semibold text-lg">Create Slot</div>
              <div className="text-white/60 text-sm mt-1">
                Add availability for patients to book.
              </div>

              <form onSubmit={createSlot} className="mt-4 space-y-3">
                <div>
                  <label className="text-xs text-white/60">Date</label>
                  <input
                    type="date"
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                               focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">Start Time</label>
                  <input
                    type="time"
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                               focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-white/60">End Time</label>
                  <input
                    type="time"
                    className="mt-2 w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                               focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded-2xl font-semibold text-zinc-950
                             bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                             hover:brightness-110 active:brightness-95 transition
                             shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
                >
                  Add Slot
                </button>

                <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-4 text-white/60 text-xs">
                  Tip: Create 30-min slots like <span className="text-white/80">10:00–10:30</span>,
                  <span className="text-white/80"> 10:30–11:00</span>.
                </div>
              </form>
            </div>
          </div>

          {/* Slots List */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-white font-semibold text-lg">My Slots</div>
                  <div className="text-white/60 text-sm mt-1">
                    {date} • View available and booked slots
                  </div>
                </div>

                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white/70 bg-white/5 ring-1 ring-white/10">
                  {slots.length} slot(s)
                </span>
              </div>

              <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {slots.map((s) => (
                  <div
                    key={s._id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-white font-semibold">
                        {s.startTime} – {s.endTime}
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                          s.isBooked
                            ? "text-red-200 bg-red-500/10 ring-1 ring-red-400/20"
                            : "text-emerald-200 bg-emerald-500/10 ring-1 ring-emerald-400/20"
                        }`}
                      >
                        {s.isBooked ? "Booked" : "Available"}
                      </span>
                    </div>

                    {!s.isBooked && (
                      <button
                        onClick={() => deleteSlot(s._id)}
                        className="mt-3 w-full px-3 py-2 rounded-xl text-sm font-semibold
                                   bg-white/5 text-white/80 ring-1 ring-white/10
                                   hover:bg-white/10 transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {slots.length === 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/60">
                  No slots found for this date.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="text-white font-semibold text-lg">My Appointments</div>
              <div className="text-white/60 text-sm mt-1">
                View patients who booked your slots.
              </div>
            </div>

            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white/70 bg-white/5 ring-1 ring-white/10">
              {appointments.length} appointment(s)
            </span>
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-4">
            {appointments.map((a) => (
              <div
                key={a._id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-white font-semibold">
                      Patient: {a.patientId?.name || "—"}
                    </div>
                    <div className="text-white/60 text-sm mt-1">
                      {a.slotId?.date} • {a.slotId?.startTime}-{a.slotId?.endTime}
                    </div>
                  </div>

                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </div>

                {a.patientId?.phone && (
                  <div className="mt-3 text-sm text-white/70">
                    Contact: <span className="text-white">{a.patientId.phone}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {appointments.length === 0 && (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-white/60">
              No appointments yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}