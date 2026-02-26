import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await authService.register({
        name,
        email,
        phone,
        password,
        role: "PATIENT",
      });
      setSession(data.token, data.user);
      toast.success("Account created ✨");
      navigate("/doctors");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-4">
      {/* Glass Card */}
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 
                   rounded-3xl shadow-2xl p-8 space-y-6"
      >
        {/* Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-white/60 text-sm mt-1">
            Join for a luxury booking experience
          </p>
        </div>

        {/* Name */}
        <div>
          <label className="text-sm text-white/70">Name</label>
          <input
            required
            className="w-full mt-2 bg-white/10 border border-white/20 
                       rounded-xl px-4 py-3 text-white placeholder-white/40
                       focus:outline-none focus:ring-2 focus:ring-amber-400 
                       focus:border-amber-400 transition"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-white/70">Email</label>
          <input
            type="email"
            required
            className="w-full mt-2 bg-white/10 border border-white/20 
                       rounded-xl px-4 py-3 text-white placeholder-white/40
                       focus:outline-none focus:ring-2 focus:ring-amber-400 
                       focus:border-amber-400 transition"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm text-white/70">Phone</label>
          <input
            required
            className="w-full mt-2 bg-white/10 border border-white/20 
                       rounded-xl px-4 py-3 text-white placeholder-white/40
                       focus:outline-none focus:ring-2 focus:ring-amber-400 
                       focus:border-amber-400 transition"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-white/70">Password</label>
          <input
            type="password"
            required
            className="w-full mt-2 bg-white/10 border border-white/20 
                       rounded-xl px-4 py-3 text-white placeholder-white/40
                       focus:outline-none focus:ring-2 focus:ring-amber-400 
                       focus:border-amber-400 transition"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl font-semibold text-black 
                     bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500
                     hover:brightness-110 active:brightness-95
                     shadow-[0_10px_30px_rgba(245,158,11,0.3)]
                     transition"
        >
          Register
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link
            className="text-amber-400 hover:text-amber-300 font-medium"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}