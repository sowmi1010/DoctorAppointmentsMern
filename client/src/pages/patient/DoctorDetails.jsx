import { useEffect, useState } from "react";
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
      await appointmentService.book({ doctorId: id, slotId, reason: "Consultation" });
      toast.success("Appointment booked!");
      await load(); // refresh slots
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setBooking("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-5xl p-4">
        {doctor && (
          <div className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="text-2xl font-bold">{doctor.userId?.name}</div>
            <div className="text-gray-600">{doctor.specialization}</div>
            <div className="mt-2">Fee: ₹{doctor.consultationFee}</div>
            <div className="text-sm mt-2 text-gray-600">{doctor.clinicAddress}</div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="font-semibold">Choose Date:</div>
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {slots.map((s) => (
              <button
                key={s._id}
                onClick={() => book(s._id)}
                disabled={booking === s._id}
                className="border rounded-lg p-3 hover:bg-gray-50 disabled:opacity-60"
              >
                <div className="font-semibold">{s.startTime} - {s.endTime}</div>
                <div className="text-xs text-gray-500">Available</div>
              </button>
            ))}
          </div>

          {slots.length === 0 && (
            <div className="text-gray-500">No available slots for this date.</div>
          )}
        </div>
      </div>
    </div>
  );
}