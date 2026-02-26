import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">
      {/* Glow */}
      <div className="absolute -top-32 -right-32 h-96 w-96 bg-amber-500/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-32 -left-32 h-96 w-96 bg-yellow-500/10 blur-3xl rounded-full" />

      {/* Glass card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10 text-center">
        {/* 403 */}
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500">
          403
        </h1>

        <h2 className="text-xl font-semibold text-white mt-4">
          Unauthorized Access
        </h2>

        <p className="text-white/60 text-sm mt-3">
          You don’t have permission to view this page. Please login with the correct account.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/doctors"
            className="px-6 py-3 rounded-2xl font-semibold text-white/90 bg-white/10 ring-1 ring-white/15
                       hover:bg-white/15 transition"
          >
            Go to Doctors
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-2xl font-semibold text-black
                       bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                       hover:brightness-110 active:brightness-95 transition
                       shadow-[0_10px_30px_rgba(245,158,11,0.3)]"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}