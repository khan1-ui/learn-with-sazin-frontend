import { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

/* =========================
   HELPERS
========================= */
const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const TRIAL_QUESTION_LIMIT = 5; // 🔒 policy: free trial = 5 questions

export default function StudentMCQStart() {
  const { mcqId } = useParams();
  const [searchParams] = useSearchParams();
  const isTrial = searchParams.get("trial") === "true";

  const { user } = useAuth();
  const navigate = useNavigate();

  /* =========================
     STATE
  ========================== */
  const [mcq, setMcq] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* =========================
     FETCH MCQ (UPGRADED)
  ========================== */
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchMCQ = async () => {
      try {
        const url = `/quizzes/${mcqId}${isTrial ? "?trial=true" : ""}`;
        const { data } = await API.get(url);

        setMcq(data);

        // ⏱️ time policy
        const duration = isTrial
          ? TRIAL_QUESTION_LIMIT * 60
          : data.duration;

        setTimeLeft(duration);
      } catch (error) {
        console.error("MCQ start error:", error);
        navigate("/student/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchMCQ();
  }, [mcqId, isTrial, user, navigate]);

  /* =========================
     QUESTIONS (TRIAL SLICE)
     🔥 ROOT FIX: ৩০ প্রশ্ন → ৫ প্রশ্ন
  ========================== */
  const questions = useMemo(() => {
    if (!mcq?.questions) return [];
    return isTrial
      ? mcq.questions.slice(0, TRIAL_QUESTION_LIMIT)
      : mcq.questions;
  }, [mcq, isTrial]);

  const currentQuestion = questions[currentIndex];

  /* =========================
     TIMER
  ========================== */
  useEffect(() => {
    if (timeLeft <= 0 || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(true); // ⏱ auto submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting]);

  /* =========================
     HANDLERS
  ========================== */
  const handleSelect = (optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex, // index-based (safe)
    }));
  };

  const handleSubmit = async (auto = false) => {
    if (submitting) return;

    if (!auto && Object.keys(answers).length < questions.length) {
      alert("Please answer all questions");
      return;
    }

    setSubmitting(true);

    try {
      const formattedAnswers = Object.entries(answers).map(
        ([index, selectedOption]) => ({
          questionId: questions[index]._id,
          selectedOption,
        })
      );

      await API.post("/results", {
        quizId: mcqId,
        answers: formattedAnswers,
        isTrial, // ✅ policy flag
      });

      navigate(`/student/result/${mcqId}`);
    } catch (error) {
      console.error("Submit MCQ error:", error);
      setSubmitting(false);
    }
  };

  /* =========================
     UI GUARDS
  ========================== */
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading MCQ...
      </p>
    );
  }

  if (!mcq || questions.length === 0) {
    return (
      <p className="text-center mt-20 text-red-500">
        Invalid MCQ data
      </p>
    );
  }

  /* =========================
     UI
  ========================== */
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">{mcq.title}</h1>
          <p className="text-sm text-gray-500">
            {isTrial
              ? `Free Trial • ${TRIAL_QUESTION_LIMIT} Questions`
              : "Full MCQ"}
          </p>
        </div>

        <div className="text-lg font-semibold text-red-600">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* QUESTION */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4">
          Q{currentIndex + 1}. {currentQuestion.question}
        </h2>

        <div className="space-y-2">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-4 py-2 rounded border transition ${
                answers[currentIndex] === idx
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅ Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded"
          >
            Next ➡
          </button>
        ) : (
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            🚀 Submit
          </button>
        )}
      </div>
    </div>
  );
}
