import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full border-b bg-white">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <Link to="/doctors" className="font-bold text-lg">
          Doctor Appointments
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Role based quick links */}
              <div className="hidden sm:flex items-center gap-3">
                {user.role === "PATIENT" && (
                  <Link className="text-sm underline" to="/patient/appointments">
                    My Appointments
                  </Link>
                )}

                {user.role === "DOCTOR" && (
                  <Link className="text-sm underline" to="/doctor/dashboard">
                    Doctor Dashboard
                  </Link>
                )}

                {user.role === "ADMIN" && (
                  <Link className="text-sm underline" to="/admin/dashboard">
                    Admin Dashboard
                  </Link>
                )}
              </div>

              {/* user info */}
              <span className="text-sm text-gray-600">
                {user.name} ({user.role})
              </span>

              {/* logout */}
              <button
                onClick={onLogout}
                className="px-3 py-1 rounded bg-black text-white text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="text-sm" to="/login">
                Login
              </Link>
              <Link className="text-sm" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}