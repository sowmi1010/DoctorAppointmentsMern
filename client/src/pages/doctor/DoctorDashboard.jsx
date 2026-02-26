import { useEffect, useState } from "react";
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

  const load = async () => {
    try {
      const prof = await doctorService.myProfile();
      setDoctor(prof.data.doctor);

      // show ALL slots (including booked) for doctor on that date:
      const s = await slotService.list({ doctorId: prof.data.doctor._id, date, available: false });
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
      toast.success("Slot created");
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-5xl p-4 space-y-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-xl font-bold">Doctor Dashboard</div>
          {doctor && (
            <div className="text-sm text-gray-600 mt-1">
              {doctor.userId?.name} • {doctor.specialization}
            </div>
          )}
        </div>

        {/* Create Slot */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">Create Availability Slot</div>

          <form onSubmit={createSlot} className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-sm">Date</label>
              <input
                type="date"
                className="block border rounded px-3 py-2"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">Start</label>
              <input
                type="time"
                className="block border rounded px-3 py-2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm">End</label>
              <input
                type="time"
                className="block border rounded px-3 py-2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <button className="bg-black text-white rounded px-4 py-2">
              Add Slot
            </button>
          </form>
        </div>

        {/* Slots List */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">My Slots ({date})</div>

          <div className="grid sm:grid-cols-3 gap-3">
            {slots.map((s) => (
              <div key={s._id} className="border rounded-lg p-3">
                <div className="font-semibold">{s.startTime} - {s.endTime}</div>
                <div className={`text-xs mt-1 ${s.isBooked ? "text-red-600" : "text-green-700"}`}>
                  {s.isBooked ? "Booked" : "Available"}
                </div>

                {!s.isBooked && (
                  <button
                    onClick={() => deleteSlot(s._id)}
                    className="mt-2 text-sm underline text-gray-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {slots.length === 0 && (
            <div className="text-gray-500">No slots found for this date.</div>
          )}
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">My Appointments</div>

          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a._id} className="border rounded-lg p-3">
                <div className="font-semibold">
                  Patient: {a.patientId?.name}
                </div>
                <div className="text-sm text-gray-600">
                  Slot: {a.slotId?.date} • {a.slotId?.startTime}-{a.slotId?.endTime}
                </div>
                <div className="text-sm">
                  Status: <span className="font-semibold">{a.status}</span>
                </div>
              </div>
            ))}
          </div>

          {appointments.length === 0 && (
            <div className="text-gray-500">No appointments yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}