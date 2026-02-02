import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import Card from "../../components/Card";
import QuizJSONImport from "../../components/QuizJSONImport";
import Header from "../../components/Header";
import TeacherAnalytics from "../../components/TeacherAnalytics";
import Footer from "../../components/Footer";
import TeacherQuizBuilder from "../../components/TeacherQuizBuilder";
import ConfirmModal from "../../components/ConfirmModal";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeQuizId, setActiveQuizId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  /* =========================
     🔐 AUTH GUARD (STRONG)
  ========================== */
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/teacher/login");
    } else if (role !== "teacher") {
      toast.error("Teacher access only");
      navigate("/");
    }
  }, [isAuthenticated, role, navigate]);

  /* =========================
     FETCH QUIZZES
  ========================== */
  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/quizzes/teacher");
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && role === "teacher") {
      fetchQuizzes();
    }
  }, [isAuthenticated, role, fetchQuizzes]);

  /* =========================
     DELETE QUIZ
  ========================== */
  const handleDeleteQuiz = async () => {
    if (!deleteTarget) return;

    try {
      await API.delete(`/quizzes/${deleteTarget._id}`);
      toast.success("🗑️ Quiz deleted");
      setDeleteTarget(null);
      fetchQuizzes();
    } catch {
      toast.error("Delete failed");
    }
  };

  /* =========================
     PUBLISH / UNPUBLISH
  ========================== */
  const togglePublish = async (quizId) => {
    try {
      const { data } = await API.patch(`/quizzes/${quizId}/publish`);
      toast.success(
        data.data.isPublished ? "✅ Published" : "📄 Moved to Draft"
      );
      fetchQuizzes();
    } catch {
      toast.error("Publish failed");
    }
  };

  /* =========================
     FILTERED QUIZZES
  ========================== */
  const filteredQuizzes = quizzes.filter((q) => {
    const classMatch =
      !filterClass || String(q.classLevel) === String(filterClass);

    const subjectText =
      typeof q.subject === "string" ? q.subject : q.subject?.name || "";

    const subjectMatch =
      !filterSubject ||
      subjectText.toLowerCase().includes(filterSubject.toLowerCase());

    return classMatch && subjectMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header role="teacher" />
      <TeacherAnalytics teacher={user} />

      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        {/* ===== TOP BAR ===== */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">
            👩‍🏫 Teacher Dashboard
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/teacher/prices")}
              className="flex items-center gap-2 bg-green-600 
                         text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <DollarSign size={16} />
              Price Management
            </button>

            <button
              onClick={() => setActiveQuizId("new")}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              + Create Quiz
            </button>
          </div>
        </div>

        {/* ===== FILTERS ===== */}
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All Classes</option>
            {[6, 7, 8, 9, 10].map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search subject..."
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="border p-2 rounded"
          />
        </div>

        {/* ===== JSON IMPORT ===== */}
        <QuizJSONImport onImported={fetchQuizzes} />

        {/* ===== QUIZ BUILDER ===== */}
        {activeQuizId !== null && (
          <TeacherQuizBuilder
            key={activeQuizId}
            quizId={activeQuizId === "new" ? null : activeQuizId}
            onQuizSaved={() => {
              setActiveQuizId(null);
              fetchQuizzes();
            }}
            onClose={() => setActiveQuizId(null)}
          />
        )}

        {/* ===== QUIZ LIST ===== */}
        {loading ? (
          <p className="text-center mt-10">Loading quizzes...</p>
        ) : filteredQuizzes.length === 0 ? (
          <p className="text-center mt-10">No quizzes found</p>
        ) : (
          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz._id} className="relative p-4">
                {/* ACTIONS */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setActiveQuizId(quiz._id)}
                    className="p-2 bg-indigo-600 text-white rounded-full"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(quiz)}
                    className="p-2 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="font-semibold">{quiz.title}</h3>
                <p className="text-sm text-gray-500">
                  {quiz.questions.length} questions
                </p>
                <p className="text-sm text-gray-500">
                  Class {quiz.classLevel} •{" "}
                  {typeof quiz.subject === "string"
                    ? quiz.subject
                    : quiz.subject?.name}
                </p>

                {!quiz.isPublished && (
                  <span className="inline-block mt-2 text-xs 
                                   bg-yellow-100 text-yellow-700 
                                   px-2 py-1 rounded">
                    Draft
                  </span>
                )}

                <div className="mt-3">
                  <button
                    onClick={() => togglePublish(quiz._id)}
                    className={`w-full px-3 py-1 rounded text-xs text-white ${
                      quiz.isPublished
                        ? "bg-green-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {quiz.isPublished ? "Published" : "Publish"}
                  </button>
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* ===== DELETE CONFIRM ===== */}
        <ConfirmModal
          open={!!deleteTarget}
          title="Delete Quiz?"
          message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteQuiz}
        />
      </main>

      <Footer />
    </div>
  );
}
