import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import { doctorService } from "../../services/doctorService";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      const { data } = await doctorService.list(q);
      setDoctors(data.doctors || []);
    } catch (err) {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-5xl p-4">
        <div className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Search by doctor name or specialization..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="bg-black text-white px-4 rounded" onClick={load}>
            Search
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {doctors.map((d) => (
            <Link
              key={d._id}
              to={`/doctors/${d._id}`}
              className="bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <div className="font-bold text-lg">{d.userId?.name}</div>
              <div className="text-sm text-gray-600">{d.specialization}</div>
              <div className="text-sm mt-2">Fee: ₹{d.consultationFee}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}