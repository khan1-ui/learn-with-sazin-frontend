// frontend/src/pages/teacher/TeacherEditProfile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";

export default function TeacherEditProfile() {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      if (avatar) formData.append("avatar", avatar);

      const { data } = await API.put("/teachers/profile", formData);

      completeProfile(data.data);

      toast.success("Profile updated ✅");
    } catch {
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Edit Profile</h2>

          <button
            type="button"
            onClick={() => navigate("/teacher/dashboard")}
            className="text-sm px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            🏠 Dashboard
          </button>
        </div>

        {/* ===== FORM ===== */}
        <form onSubmit={submitHandler} className="space-y-4">
          <input
            className="w-full border p-2 rounded"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border p-2 rounded"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setAvatar(e.target.files[0])}
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
