import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import API from "../../api/axios";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Card from "../../components/Card";
import StudentBottomNav from "../../components/StudentBottomNav";
import ProfileImageUpload from "../../components/ProfileImageUpload";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, token, completeProfile } = useAuth(); // 🔥 token from context
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

const avatar = user?.avatar
  ? `${API_BASE}${user.avatar}`
  : "/default-avatar.png";



  /* =========================
     FETCH PROFILE DATA
  ========================== */
  useEffect(() => {
    if (!user || !token) return;

    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [resultRes, progressRes] = await Promise.all([
          API.get("/results", { headers }),
          API.get("/progress/subjects", { headers }),
        ]);

        setResults(resultRes.data);
        setSubjectProgress(progressRes.data);
      } catch (err) {
        console.error("Profile data fetch failed:", err);
      }
    };

    fetchData();
  }, [user, token]);

  /* =========================
     OVERALL PROGRESS
  ========================== */
  const totalScore = results.reduce((acc, r) => acc + r.score, 0);
  const totalQuestions = results.reduce(
    (acc, r) => acc + r.totalQuestions,
    0
  );

  const progress = totalQuestions
    ? Math.round((totalScore / totalQuestions) * 100)
    : 0;

  /* =========================
     AVATAR UPDATE (FIXED)
  ========================== */
 const handleAvatarUpdate = async (file) => {
  if (!file || !token) return false;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    setLoading(true);

    const response = await API.put(
      "/users/profile/avatar",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const avatar = response.data?.avatar;

    if (!avatar) {
      throw new Error("Avatar not returned from server");
    }

    // 🔥 update auth context
    completeProfile({ avatar });

    return true; // ✅ VERY IMPORTANT
  } catch (err) {
    console.error("Avatar upload error:", err);
    toast.error("Avatar update failed ❌");
    return false; // ✅ VERY IMPORTANT
  } finally {
    setLoading(false);
  }
};


  if (!user) return null;

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header role="student" />

      <div className="max-w-5xl mx-auto px-6 pt-4 text-sm text-gray-500">
        <span
          onClick={() => navigate("/student/dashboard")}
          className="cursor-pointer hover:text-indigo-600"
        >
          Dashboard
        </span>
        <span className="mx-2">›</span>
        <span className="text-gray-700 font-medium">Profile</span>
      </div>

      <main className="flex-1 max-w-5xl mx-auto p-6 space-y-6">
        {/* ===== PROFILE INFO ===== */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">🎓 Student Profile</h2>

            <button
              onClick={() => navigate("/student/dashboard")}
              className="px-4 py-2 text-sm rounded 
                         bg-indigo-600 hover:bg-indigo-700 
                         text-white transition"
            >
              🏠 Dashboard
            </button>
          </div>

          <div className="flex items-center gap-6">
            <ProfileImageUpload
              avatar={avatar}
              onChange={handleAvatarUpdate}
              loading={loading}
            />

            <div className="text-gray-700 space-y-1">
              <p>
                <b>Name:</b> {user.name}
              </p>
              <p>
                <b>Class:</b> {user.classLevel || "Not set"}
              </p>
              <p>
                <b>Phone:</b> {user.phone || "Not set"}
              </p>
            </div>
          </div>
        </Card>

        {/* ===== OVERALL PROGRESS ===== */}
        <Card>
          <h3 className="font-semibold mb-2">📊 Overall Progress</h3>

          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-indigo-600 h-4 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            {progress}% completed overall
          </p>
        </Card>

        {/* ===== SUBJECT-WISE PROGRESS ===== */}
        <Card>
          <h3 className="font-semibold mb-4">📘 Subject-wise Progress</h3>

          {subjectProgress.length === 0 ? (
            <p className="text-sm text-gray-500">
              No subject progress yet.
            </p>
          ) : (
            <div className="space-y-4">
              {subjectProgress.map((p) => (
                <div
                  key={`${p.classLevel}-${p.subject}`}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">
                      {p.subject} (Class {p.classLevel})
                    </span>
                    <span className="text-sm text-gray-600">
                      {p.completed} / {p.total} অধ্যায়
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-green-600 h-2 rounded transition-all"
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {p.percentage}% completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ===== QUIZ PERFORMANCE ===== */}
        <Card>
          <h3 className="font-semibold mb-4">📝 MCQ Performance</h3>

          {results.length === 0 ? (
            <p className="text-sm text-gray-500">
              No MCQ attempts yet.
            </p>
          ) : (
            <div className="space-y-3">
              {results.map((r) => {
                const percent = Math.round(r.percentage);

                return (
                  <div key={r._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{r.quiz?.title}</span>
                      <span>{percent}%</span>
                    </div>

                    <div className="w-full bg-gray-200 h-3 rounded-full">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </main>

      <button
        onClick={() => navigate("/student/dashboard")}
        className="fixed bottom-20 right-4 z-50
                   bg-indigo-600 hover:bg-indigo-700
                   text-white px-4 py-3 rounded-full
                   shadow-lg transition"
      >
        🔙 Dashboard
      </button>

      <StudentBottomNav />
      <Footer />
    </div>
  );
}
