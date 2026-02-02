import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const submitHandler = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const { data } = await API.post("/auth/teacher/login", {
      email,
      password,
    });

    const { user, token } = data.data;

// 🔥 ONLY AuthContext
login({ user, token });

navigate(
  user.profileCompleted
    ? "/teacher/dashboard"
    : "/teacher/profile/create",
  { replace: true }
);

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-slate-900">
      <div className="hidden md:flex flex-col justify-center px-14 text-white">
        <ShieldCheck size={48} className="text-indigo-400 mb-4" />
        <h1 className="text-4xl font-bold leading-tight">
          Teacher Control Panel
        </h1>
        <p className="mt-4 text-slate-300 text-lg">
          Secure access for authorized teachers only. Manage students, quizzes &
          learning flow.
        </p>
      </div>

      <div className="flex items-center justify-center px-6">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            🧑‍🏫 Teacher Login
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Authorized access only
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4 text-center">
              {error}
            </div>
          )}

          <input
            type="email"
            placeholder="Teacher Email"
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Teacher Secret Key"
            className="w-full border rounded-lg px-4 py-2 mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            {loading ? "Authenticating..." : "Login as Teacher"}
          </button>

          <p className="text-xs text-center text-gray-400 mt-4">
            Unauthorized access is prohibited
          </p>
        </form>
      </div>
    </div>
  );
}
