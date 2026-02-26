import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar";
import { adminService } from "../../services/adminService";
import CreateDoctor from "./CreateDoctor";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  const load = async () => {
    try {
      const s = await adminService.stats();
      setStats(s.data.stats);

      const u = await adminService.users();
      setUsers(u.data.users || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load admin dashboard");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const statCards = useMemo(
    () => [
      { title: "Users", value: stats?.users ?? "-" },
      { title: "Doctors", value: stats?.doctors ?? "-" },
      { title: "Slots", value: stats?.slots ?? "-" },
      { title: "Appointments", value: stats?.appointments ?? "-" },
    ],
    [stats]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.18em] uppercase text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20">
                Control Center
              </span>

              <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Admin Command Hub
              </h1>

              <p className="mt-3 max-w-2xl text-sm md:text-base text-white/60">
                Monitor growth, onboard doctors, and manage users from one premium dashboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:max-w-xs w-full">
              <QuickChip label="Today" value={new Date().toLocaleDateString()} />
              <QuickChip label="Users" value={users.length} />
              <QuickChip label="Doctors" value={stats?.doctors ?? "-"} />
              <QuickChip label="Appointments" value={stats?.appointments ?? "-"} />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((c) => (
            <StatCard key={c.title} title={c.title} value={c.value} />
          ))}
        </section>

        {/* Create Doctor + Recent Users */}
        <section className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5 md:p-6">
            <h2 className="text-white font-semibold text-lg">Create Doctor</h2>
            <p className="text-white/60 text-sm mt-1">
              Add a new doctor and auto-generate the doctor profile.
            </p>
            <div className="mt-4">
              <CreateDoctor onSuccess={load} />
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5 md:p-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-white font-semibold text-lg">Recent Users</h2>
              <span className="rounded-full px-3 py-1 text-xs font-semibold text-white/70 bg-white/5 ring-1 ring-white/10">
                {users.length} Total
              </span>
            </div>

            <p className="mt-2 text-sm text-white/60">
              Latest registered users for quick review.
            </p>

            <div className="mt-4 space-y-3">
              {users.slice(0, 5).map((u) => (
                <div
                  key={u._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-white/60 mt-1">{u.email}</div>
                    </div>
                    <RoleBadge role={u.role} />
                  </div>
                  <div className="text-xs text-white/60 mt-3">
                    Joined {formatDate(u.createdAt)}
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                No users found yet.
              </div>
            )}
          </aside>
        </section>

        {/* User Directory */}
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5 md:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-white font-semibold text-lg">User Directory</h2>
            <p className="text-sm text-white/60">
              Synced from your admin API.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left text-xs uppercase tracking-[0.14em] text-white/60">
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold hidden md:table-cell">Email</th>
                  <th className="py-3 px-4 font-semibold hidden lg:table-cell">Phone</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-white/60 mt-1 md:hidden">
                        {u.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/70 hidden md:table-cell">
                      {u.email}
                    </td>
                    <td className="py-3 px-4 text-white/70 hidden lg:table-cell">
                      {u.phone || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3 px-4 text-white/70">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <p className="mt-4 text-sm text-white/60">No users found.</p>
          )}
        </section>
      </div>
    </div>
  );
}

/* ---------- Small UI Components ---------- */

function StatCard({ title, value }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl p-5">
      <div className="absolute -top-16 -right-16 h-40 w-40 bg-amber-500/10 blur-3xl" />
      <div className="relative">
        <div className="h-1.5 w-16 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500" />
        <div className="mt-4 text-sm font-semibold text-white/70">{title}</div>
        <div className="mt-1 text-3xl font-extrabold tracking-tight text-white">
          {value}
        </div>
        <div className="mt-2 text-xs text-white/55">Live count from database</div>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const style =
    role === "ADMIN"
      ? "text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20"
      : role === "DOCTOR"
      ? "text-sky-200 bg-sky-500/10 ring-1 ring-sky-400/20"
      : role === "PATIENT"
      ? "text-emerald-200 bg-emerald-500/10 ring-1 ring-emerald-400/20"
      : "text-white/70 bg-white/5 ring-1 ring-white/10";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
      {role}
    </span>
  );
}

function QuickChip({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.16em] text-white/60">
        {label}
      </div>
      <div className="mt-1 text-base font-bold text-white">{value}</div>
    </div>
  );
}

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString();
}