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
    } catch {
      toast.error("Failed to load doctors");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Find Your Specialist
          </h1>
          <p className="text-white/60 mt-2">
            Book premium healthcare appointments instantly.
          </p>
        </div>

        {/* Search Bar */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 
                        rounded-3xl p-4 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="flex-1 rounded-2xl px-4 py-3 bg-white/10 border border-white/15 
                         text-white placeholder-white/40
                         focus:outline-none focus:ring-2 focus:ring-amber-400 
                         focus:border-amber-400 transition"
              placeholder="Search by doctor name or specialization..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button
              onClick={load}
              className="px-6 py-3 rounded-2xl font-semibold text-black 
                         bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                         hover:brightness-110 transition
                         shadow-[0_10px_30px_rgba(245,158,11,0.3)]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <Link
              key={d._id}
              to={`/doctors/${d._id}`}
              className="group relative overflow-hidden rounded-3xl 
                         border border-white/10 bg-white/5 backdrop-blur-xl 
                         p-6 shadow-xl transition 
                         hover:border-amber-400/30 hover:bg-white/8"
            >
              {/* Glow effect */}
              <div className="absolute -top-16 -right-16 h-40 w-40 
                              bg-amber-500/20 blur-3xl opacity-0 
                              group-hover:opacity-100 transition" />

              <div className="relative">
                {/* Avatar */}
                <div className="h-14 w-14 rounded-2xl 
                                bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 
                                ring-1 ring-white/20 flex items-center justify-center 
                                text-zinc-950 font-bold text-lg mb-4">
                  {d.userId?.name?.slice(0, 1).toUpperCase()}
                </div>

                {/* Name */}
                <div className="text-xl font-semibold text-white">
                  {d.userId?.name}
                </div>

                {/* Specialization */}
                <div className="text-white/60 mt-1 text-sm">
                  {d.specialization}
                </div>

                {/* Fee Badge */}
                <div className="mt-4 inline-flex items-center 
                                rounded-full px-3 py-1 text-xs font-semibold 
                                text-amber-200 bg-amber-500/10 
                                ring-1 ring-amber-400/20">
                  Fee: ₹{d.consultationFee}
                </div>

                {/* Hover Button */}
                <div className="mt-5 opacity-0 group-hover:opacity-100 transition">
                  <div className="w-full text-center py-2 rounded-xl 
                                  bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 
                                  text-zinc-950 font-semibold text-sm">
                    View & Book
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className="text-center mt-12">
            <div className="text-white font-semibold text-lg">
              No doctors found.
            </div>
            <div className="text-white/60 mt-2 text-sm">
              Try searching with a different keyword.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}