import { useEffect, useState } from "react";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="mx-auto max-w-5xl p-4 space-y-4">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="text-xl font-bold">Admin Dashboard</div>
          <div className="text-sm text-gray-600 mt-1">Stats + User Management</div>
        </div>

      <CreateDoctor onSuccess={load} />

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-3">
          <StatCard title="Users" value={stats?.users ?? "-"} />
          <StatCard title="Doctors" value={stats?.doctors ?? "-"} />
          <StatCard title="Slots" value={stats?.slots ?? "-"} />
          <StatCard title="Appointments" value={stats?.appointments ?? "-"} />
        </div>

        {/* Users */}
        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-semibold mb-3">Users</div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b">
                    <td className="py-2">{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || "-"}</td>
                    <td className="font-semibold">{u.role}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="text-gray-500">No users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}