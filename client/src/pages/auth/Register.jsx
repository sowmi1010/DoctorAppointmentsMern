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
      toast.success("Registered!");
      navigate("/doctors");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-bold mb-4">Register</h1>

        <label className="text-sm">Name</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={name} onChange={(e) => setName(e.target.value)} />

        <label className="text-sm">Email</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label className="text-sm">Phone</label>
        <input className="w-full border rounded px-3 py-2 mb-3" value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label className="text-sm">Password</label>
        <input type="password" className="w-full border rounded px-3 py-2 mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button className="w-full bg-black text-white rounded py-2">
          Register
        </button>

        <p className="text-sm mt-3">
          Already have account?{" "}
          <Link className="underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}