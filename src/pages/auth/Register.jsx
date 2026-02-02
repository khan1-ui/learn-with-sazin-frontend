import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !classLevel || !password) {
      toast.error("All fields are required ❌");
      return;
    }

    if (classLevel < 6 || classLevel > 10) {
      toast.error("Class must be between 6 and 10 ❌");
      return;
    }

    const payload = {
      name: name.trim(),
      classLevel: Number(classLevel),
      password,
      email: `${name.trim()}@test.com`, // TEMP
    };

    try {
      setLoading(true);

     const { data } = await API.post("/auth/student/register", payload);

      // 🔥 FIX HERE
      const { token, user } = data.data;

      if (!token) {
        throw new Error("Token missing from register response");
      }



      // ✅ single source of truth
      login({ token, user });

      toast.success("Registration successful 🎉");

      // 👉 profile not completed yet
      navigate("/profile/create", { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Registration failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          📝 Student Registration
        </h1>

        <input
          type="text"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />

        <input
          type="number"
          placeholder="Class (6–10)"
          value={classLevel}
          onChange={(e) => setClassLevel(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          min={6}
          max={10}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border rounded"
          required
        />
        

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
