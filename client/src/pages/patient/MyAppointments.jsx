import { useEffect, useState } from "react";
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
      toast.success("Cancelled");
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cancel failed");
    }
  };

  const openReschedule = async (appt) => {
    setRescheduleId(appt._id);
    setNewSlotId("");

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
      toast.success("Rescheduled");
      setRescheduleId(null);
      setNewSlotId("");
      setAvailableSlots([]);
      await load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Reschedule failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-5xl p-4">
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="text-xl font-bold">My Appointments</div>
        </div>

        {loading && <div className="p-4">Loading...</div>}

        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a._id} className="bg-white rounded-xl shadow p-4">
              <div className="font-semibold text-lg">
                Doctor: {a.doctorId?.userId?.name}
              </div>
              <div className="text-sm text-gray-600">
                {a.slotId?.date} • {a.slotId?.startTime}-{a.slotId?.endTime}
              </div>
              <div className="text-sm mt-1">
                Status: <span className="font-semibold">{a.status}</span>
              </div>

              {a.status === "BOOKED" && (
                <div className="flex flex-wrap gap-3 mt-3">
                  <button
                    onClick={() => cancel(a._id)}
                    className="px-4 py-2 rounded bg-red-600 text-white text-sm"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => openReschedule(a)}
                    className="px-4 py-2 rounded bg-black text-white text-sm"
                  >
                    Reschedule
                  </button>
                </div>
              )}

              {/* Reschedule panel */}
              {rescheduleId === a._id && (
                <div className="mt-4 border rounded-lg p-3 bg-gray-50">
                  <div className="font-semibold mb-2">Choose New Slot</div>

                  <select
                    className="w-full border rounded px-3 py-2"
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

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={doReschedule}
                      className="px-4 py-2 rounded bg-green-600 text-white text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setRescheduleId(null);
                        setNewSlotId("");
                        setAvailableSlots([]);
                      }}
                      className="px-4 py-2 rounded border text-sm"
                    >
                      Close
                    </button>
                  </div>

                  {availableSlots.length === 0 && (
                    <div className="text-sm text-gray-500 mt-2">
                      No available slots on this date.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {appointments.length === 0 && !loading && (
          <div className="text-gray-500">No appointments found.</div>
        )}
      </div>
    </div>
  );
}