// frontend/src/pages/teacher/TeacherCreateProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { toast } from "react-toastify";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";

export default function TeacherCreateProfile() {
  const navigate = useNavigate();
  const { user, token, completeProfile } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔐 Guard
  useEffect(() => {
    if (!user || !token) {
      navigate("/teacher/login", { replace: true });
      return;
    }

    if (user.profileCompleted) {
      navigate("/teacher/dashboard", { replace: true });
    }
  }, [user, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !avatar) {
      toast.error("All fields required");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("avatar", avatar);

      const { data } = await API.post("/teachers/profile", formData);

      completeProfile({
        ...data.data,
        profileCompleted: true,
      });

      toast.success("Profile created 🎉");
      navigate("/teacher/dashboard", { replace: true });
    } catch {
      toast.error("Profile creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header role="teacher" />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-bold text-center">Create Teacher Profile</h2>

        <input className="w-full border p-2" placeholder="Full Name" onChange={e => setName(e.target.value)} />
        <input className="w-full border p-2" placeholder="Phone" onChange={e => setPhone(e.target.value)} />
        <input type="file" onChange={e => setAvatar(e.target.files[0])} />

        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
