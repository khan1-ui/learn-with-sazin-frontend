import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FreeModels from "../../components/FreeModels";
import PaidSubjects from "../../components/PaidSubjects";
import PaidModels from "../../components/PaidModels";
import { useAuth } from "../../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================== */
  const [activeClass, setActiveClass] = useState(() => {
    const saved = localStorage.getItem("activeClass");
    return saved ? Number(saved) : null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "free";
  });

  const [activeSubject, setActiveSubject] = useState(null);

  /* =========================
     AUTH GUARD
  ========================== */
  useEffect(() => {
    if (!user) navigate("/login");
    else if (!user.profileCompleted) navigate("/profile");
  }, [user, navigate]);

  if (!user) return null;

  /* =========================
     HANDLERS
  ========================== */
  const handleClassSelect = (cls) => {
    setActiveClass(cls);
    setActiveSubject(null);
    localStorage.setItem("activeClass", cls);
  };

  const handleTabSelect = (tab) => {
    setActiveTab(tab);
    setActiveSubject(null);
    localStorage.setItem("activeTab", tab);
  };

  /* =========================
     UI
  ========================== */
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header role="student" />

      <main className="flex-1 max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* ===== TITLE ===== */}
        <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
          🎓 Student Dashboard
        </h1>

        {/* ===== CLASS SELECT ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {[6, 7, 8, 9, 10].map((cls) => (
            <button
              key={cls}
              onClick={() => handleClassSelect(cls)}
              className={`py-3 sm:py-2 rounded-lg font-semibold transition text-sm sm:text-base ${
                activeClass === cls
                  ? "bg-indigo-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              Class {cls}
            </button>
          ))}
        </div>

        {/* ===== TAB SELECT ===== */}
        {activeClass && (
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => handleTabSelect("free")}
              className={`flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-lg font-semibold transition text-sm ${
                activeTab === "free"
                  ? "bg-green-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              Free MCQ
            </button>

            <button
              onClick={() => handleTabSelect("paid")}
              className={`flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-lg font-semibold transition text-sm ${
                activeTab === "paid"
                  ? "bg-red-600 text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              Paid MCQ
            </button>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!activeClass && (
          <p className="text-center text-gray-500 mt-10 text-sm sm:text-base">
            👆 Please select a class to continue
          </p>
        )}

        {/* ===== FREE FLOW ===== */}
        {activeClass && activeTab === "free" && (
          <FreeModels classLevel={activeClass} />
        )}

        {/* ===== PAID FLOW ===== */}
        {activeClass && activeTab === "paid" && !activeSubject && (
          <>
            <h2 className="text-base sm:text-lg font-semibold mb-4">
              📚 Select a Subject
            </h2>

            <PaidSubjects
              classLevel={activeClass}
              onSelectSubject={setActiveSubject}
            />
          </>
        )}

        {activeClass && activeTab === "paid" && activeSubject && (
          <>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setActiveSubject(null)}
                className="text-sm text-indigo-600"
              >
                ← Back
              </button>

              <h2 className="text-base sm:text-lg font-semibold">
                📘 {activeSubject}
              </h2>
            </div>

            <PaidModels
              classLevel={activeClass}
              subject={activeSubject}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
