import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMemo, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const onLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = useMemo(() => {
    if (!user) return [];
    const links = [];

    if (user.role === "PATIENT") {
      links.push({ to: "/patient/appointments", label: "My Appointments" });
    }
    if (user.role === "DOCTOR") {
      links.push({ to: "/doctor/dashboard", label: "Doctor Dashboard" });
    }
    if (user.role === "ADMIN") {
      links.push({ to: "/admin/dashboard", label: "Admin Dashboard" });
    }
    // Common link
    links.push({ to: "/doctors", label: "Doctors" });

    // remove duplicates just in case
    return Array.from(new Map(links.map((l) => [l.to, l])).values());
  }, [user]);

  const isActive = (to) => pathname === to;

  return (
    <header className="sticky top-0 z-50">
      {/* Premium background */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950">
        {/* Glass layer */}
        <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            {/* Brand */}
            <Link to="/doctors" className="group flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-600 shadow-[0_10px_30px_rgba(245,158,11,0.25)] ring-1 ring-white/20 flex items-center justify-center">
                <span className="font-black text-zinc-950">D</span>
              </div>

              <div className="leading-tight">
                <div className="text-white font-semibold tracking-tight text-base sm:text-lg">
                  Doctor Appointments
                </div>
                <div className="text-[11px] text-white/60 -mt-0.5">
                  Premium Care • Seamless Booking
                </div>
              </div>

              <span className="ml-2 hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold text-amber-200 bg-amber-500/10 ring-1 ring-amber-400/20">
                PRO
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <nav className="flex items-center gap-2">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className={[
                        "px-3 py-2 rounded-full text-sm transition",
                        "ring-1 ring-white/10",
                        isActive(l.to)
                          ? "bg-white/12 text-white"
                          : "text-white/70 hover:text-white hover:bg-white/10",
                      ].join(" ")}
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              )}

              {/* User pill */}
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden lg:flex items-center gap-3 rounded-full px-3 py-2 bg-white/8 ring-1 ring-white/10">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/15 flex items-center justify-center text-white font-semibold">
                      {String(user.name || "U").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="leading-tight">
                      <div className="text-sm text-white font-medium">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-white/60 -mt-0.5">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="px-4 py-2 rounded-full text-sm font-semibold
                               bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                               text-zinc-950 shadow-[0_12px_28px_rgba(245,158,11,0.25)]
                               hover:brightness-105 active:brightness-95 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-full text-sm text-white/80 hover:text-white hover:bg-white/10 ring-1 ring-white/10 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full text-sm font-semibold
                               bg-white text-zinc-950 hover:bg-zinc-100 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile button */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-2xl
                         bg-white/10 ring-1 ring-white/10 text-white hover:bg-white/15 transition"
              aria-label="Menu"
            >
              {/* simple icon */}
              <div className="space-y-1.5">
                <div className={`h-0.5 w-5 bg-white transition ${open ? "rotate-45 translate-y-2" : ""}`} />
                <div className={`h-0.5 w-5 bg-white transition ${open ? "opacity-0" : ""}`} />
                <div className={`h-0.5 w-5 bg-white transition ${open ? "-rotate-45 -translate-y-2" : ""}`} />
              </div>
            </button>
          </div>

          {/* Mobile menu */}
          {open && (
            <div className="md:hidden border-t border-white/10 bg-white/5 backdrop-blur-xl">
              <div className="mx-auto max-w-6xl px-4 py-4 space-y-3">
                {user ? (
                  <>
                    <div className="flex items-center justify-between rounded-2xl px-4 py-3 bg-white/8 ring-1 ring-white/10">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-1 ring-white/15 flex items-center justify-center text-white font-semibold">
                          {String(user.name || "U").slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{user.name}</div>
                          <div className="text-white/60 text-xs">{user.role}</div>
                        </div>
                      </div>
                      <button
                        onClick={onLogout}
                        className="px-3 py-2 rounded-xl text-sm font-semibold
                                   bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                                   text-zinc-950"
                      >
                        Logout
                      </button>
                    </div>

                    <div className="grid gap-2">
                      {navLinks.map((l) => (
                        <Link
                          key={l.to}
                          to={l.to}
                          onClick={() => setOpen(false)}
                          className={[
                            "rounded-2xl px-4 py-3 ring-1 ring-white/10 transition",
                            isActive(l.to)
                              ? "bg-white/12 text-white"
                              : "bg-white/6 text-white/80 hover:bg-white/10 hover:text-white",
                          ].join(" ")}
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 text-center px-4 py-3 rounded-2xl ring-1 ring-white/10 bg-white/6 text-white/90"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 text-center px-4 py-3 rounded-2xl bg-white text-zinc-950 font-semibold"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}