import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/apiClient";

export default function CreateDoctor({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    experienceYears: "",
    consultationFee: "",
    clinicAddress: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/doctors", form);
      toast.success("Doctor created");
      onSuccess();
      setForm({
        name: "",
        email: "",
        phone: "",
        password: "",
        specialization: "",
        experienceYears: "",
        consultationFee: "",
        clinicAddress: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error");
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-4">
      <div className="font-semibold mb-3">Create Doctor</div>

      <div className="grid sm:grid-cols-2 gap-3">
        {Object.keys(form).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        ))}
      </div>

      <button className="mt-3 px-4 py-2 bg-black text-white rounded">
        Create
      </button>
    </form>
  );
}