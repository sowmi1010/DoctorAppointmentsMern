import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import { appointmentService } from "../../services/appointmentService";
import { slotService } from "../../services/slotService";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // reschedule UI state
  const [rescheduleId, setRescheduleId] = useState(null);
  const [newSlotId, setNewSlotId] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await appointmentService.my();
      setAppointments(data.appointments || []);
    } catch {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const cancel = async (id) => {
    try {
      await appointmentService.cancel(id);
      toast.success("Appointment cancelled");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cancel failed");
    }
  };

  const openReschedule = async (appt) => {
    setRescheduleId(appt._id);
    setNewSlotId("");
    setAvailableSlots([]);

    try {
      const doctorId = appt.doctorId?._id;
      const date = appt.slotId?.date;

      const { data } = await slotService.list({ doctorId, date, available: true });
      setAvailableSlots(data.slots || []);
    } catch {
      toast.error("Failed to load available slots");
    }
  };

  const doReschedule = async () => {
    try {
      if (!newSlotId) {
        toast.error("Select a new slot");
        return;
      }
      await appointmentService.reschedule(rescheduleId, newSlotId);
      toast.success("Rescheduled successfully ✨");
      setRescheduleId(null);
      setNewSlotId("");
      setAvailableSlots([]);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reschedule failed");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    // iso is "YYYY-MM-DD"
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  };

  const statusStyle = useMemo(() => {
    return (status) => {
      if (status === "BOOKED")
        return "text-emerald-200 bg-emerald-500/10 ring-1 ring-emerald-400/20";
      if (status === "CANCELLED")
        return "text-red-200 bg-red-500/10 ring-1 ring-red-400/20";
      if (status === "COMPLETED")
        return "text-sky-200 bg-sky-500/10 ring-1 ring-sky-400/20";
      return "text-white/70 bg-white/5 ring-1 ring-white/10";
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Appointments
              </div>
              <div className="text-white/60 text-sm mt-1">
                Manage bookings, reschedule, or cancel with ease.
              </div>
            </div>

            <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20">
              Total: {appointments.length}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 text-white/70">
            Loading...
          </div>
        )}

        {/* List */}
        <div className="mt-6 grid gap-5">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-6"
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 bg-amber-500/10 blur-3xl" />

              <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left info */}
                <div>
                  <div className="text-white font-semibold text-lg">
                    Dr. {a.doctorId?.userId?.name || "—"}
                  </div>
                  <div className="text-white/60 text-sm mt-1">
                    {formatDate(a.slotId?.date)} • {a.slotId?.startTime}-{a.slotId?.endTime}
                  </div>

                  <div className="mt-3 inline-flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle(a.status)}`}
                    >
                      {a.status}
                    </span>

                    <span className="text-xs text-white/60">
                      Appointment ID: <span className="text-white/70">{a._id.slice(-6)}</span>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {a.status === "BOOKED" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => cancel(a._id)}
                      className="px-4 py-2 rounded-2xl text-sm font-semibold
                                 bg-red-500/15 text-red-200 ring-1 ring-red-400/25
                                 hover:bg-red-500/20 transition"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => openReschedule(a)}
                      className="px-4 py-2 rounded-2xl text-sm font-semibold
                                 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                                 text-zinc-950 hover:brightness-110 transition
                                 shadow-[0_10px_30px_rgba(245,158,11,0.25)]"
                    >
                      Reschedule
                    </button>
                  </div>
                )}
              </div>

              {/* Reschedule Panel */}
              {rescheduleId === a._id && (
                <div className="relative mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="text-white font-semibold">
                        Choose New Slot
                      </div>
                      <div className="text-white/60 text-sm mt-1">
                        Available slots for the same doctor & date.
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setRescheduleId(null);
                        setNewSlotId("");
                        setAvailableSlots([]);
                      }}
                      className="px-3 py-2 rounded-2xl text-sm text-white/70 hover:text-white
                                 bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4">
                    <select
                      className="w-full rounded-2xl px-4 py-3 bg-white/10 border border-white/15 text-white
                                 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition"
                      value={newSlotId}
                      onChange={(e) => setNewSlotId(e.target.value)}
                    >
                      <option value="">-- select slot --</option>
                      {availableSlots.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.startTime} - {s.endTime}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <button
                      onClick={doReschedule}
                      className="px-5 py-3 rounded-2xl text-sm font-semibold
                                 bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25
                                 hover:bg-emerald-500/20 transition"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() => {
                        setRescheduleId(null);
                        setNewSlotId("");
                        setAvailableSlots([]);
                      }}
                      className="px-5 py-3 rounded-2xl text-sm font-semibold
                                 bg-white/5 text-white/80 ring-1 ring-white/10
                                 hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>
                  </div>

                  {availableSlots.length === 0 && (
                    <div className="mt-3 text-sm text-white/60">
                      No available slots on this date.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty */}
        {appointments.length === 0 && !loading && (
          <div className="mt-10 text-center">
            <div className="text-white font-semibold text-lg">
              No appointments yet.
            </div>
            <div className="text-white/60 text-sm mt-2">
              Go to Doctors page and book your first appointment ✨
            </div>
          </div>
        )}
      </div>
    </div>
  );
}