import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/Card";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import Header from "../../components/Header";

export default function CreateProfile() {
  const { user, completeProfile } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ==========================
     SAFETY REDIRECT
  ========================== */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.profileCompleted) {
      navigate("/student/dashboard", { replace: true });
    }
  }, [user, navigate]);

  /* ==========================
     SUBMIT HANDLER
  ========================== */
  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone || !image) {
      setError("Phone number and image are required");
      return;
    }

    if (!user?.classLevel) {
      setError("Class information missing. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("phone", phone.trim());
      formData.append("classLevel", user.classLevel);
      formData.append("avatar", image);

      const res = await API.post("/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = res.data?.data;

      // 🔥 central auth update
      completeProfile({
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        profileCompleted: true,
      });

      toast.success("Profile created successfully 🎉");

      // ✅ correct redirect
      navigate("/student/dashboard", { replace: true });
    } catch (err) {
      console.error("PROFILE CREATE ERROR 👉", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          "Profile creation failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header role="student" />

      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <h1 className="text-xl font-bold mb-4 text-center">
            🧑‍🎓 Complete Your Profile
          </h1>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Avatar Upload */}
            <ProfileImageUpload
              avatar={
                image
                  ? URL.createObjectURL(image)
                  : user.avatar
                  ? `${import.meta.env.VITE_API_URL}${user.avatar}`
                  : "/default-avatar.png"
              }
              onChange={setImage}
              loading={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded
                         hover:bg-indigo-700 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </Card>
      </main>
    </div>
  );
}
