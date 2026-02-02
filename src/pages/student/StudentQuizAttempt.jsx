import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../../api/axios";
import { motion } from "framer-motion";
import QuizTimer from "../../components/QuizTimer";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

export default function StudentQuizAttempt() {
  const location = useLocation();
  const isTrial = new URLSearchParams(location.search).get("trial") === "true";

  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  /* =========================
     FETCH QUIZ (UPGRADED)
  ========================== */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchQuiz = async () => {
      try {
        const url = `/quizzes/${quizId}${isTrial ? "?trial=true" : ""}`;

        const { data } = await API.get(url, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setQuiz(data);
      } catch (err) {
        console.error("Quiz fetch error:", err);
        toast.error("Failed to load quiz");
        navigate("/student/dashboard");
      }
    };

    fetchQuiz();
  }, [quizId, isTrial, user, navigate]);

  /* =========================
     SAFE QUESTIONS (TRIAL FIX)
  ========================== */
  const questions = useMemo(() => {
    if (!quiz) return [];

    // 🔥 backend future-proof: if backend slices, frontend just trusts
    return quiz.questions || [];
  }, [quiz]);

  /* =========================
     SELECT ANSWER
  ========================== */
  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ]: optionIndex, // index-based (safe)
    }));
  };

  /* =========================
     SUBMIT QUIZ
  ========================== */
  const handleSubmit = async (auto = false) => {
    if (!user || submitting || timeUp) return;

    if (!auto && Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    setSubmitting(true);
    setTimeUp(true);

    const answerArray = Object.entries(answers).map(
      ([index, selectedOption]) => ({
        questionId: questions[index]._id,
        selectedOption: Number(selectedOption),
      })
    );

    try {
      await API.post(
        "/results",
        {
          quizId,
          answers: answerArray,
          isTrial, // ✅ POLICY FLAG
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      toast.success("✅ Quiz submitted successfully");
      navigate(`/student/result/${quizId}?trial=true`);
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Failed to submit quiz");
      setSubmitting(false);
      setTimeUp(false);
    }
  };

  /* =========================
     GUARDS
  ========================== */
  if (!quiz) {
    return <p className="text-center mt-10">Loading quiz...</p>;
  }

  if (!questions.length) {
    return (
      <p className="text-center mt-10 text-red-500">
        Invalid or empty quiz
      </p>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">{quiz.title}</h1>

        <QuizTimer
          seconds={quiz.duration || 300}
          onTimeUp={() => {
            if (!timeUp) {
              toast.info("⏰ Time is up! Submitting quiz...");
              handleSubmit(true);
            }
          }}
        />
      </div>

      {/* QUESTION CARD */}
      <motion.div
        key={currentQ}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-6 rounded-xl shadow"
      >
        <h2 className="font-semibold mb-4">
          Q{currentQ + 1}. {question.question}
        </h2>

        <div className="grid gap-3">
          {question.options.map((opt, i) => {
            const selected = answers[currentQ] === i;

            return (
              <motion.button
                key={i}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(i)}
                className={`p-3 border rounded-lg text-left transition
                  ${
                    selected
                      ? "bg-indigo-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
              >
                {opt}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* NAVIGATION */}
      <div className="flex justify-between mt-6">
        <button
          disabled={currentQ === 0}
          onClick={() => setCurrentQ((q) => q - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {currentQ === questions.length - 1 ? (
          <button
            disabled={submitting}
            onClick={() => handleSubmit(false)}
            className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQ((q) => q + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
