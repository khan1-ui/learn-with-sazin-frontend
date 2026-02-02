import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { motion } from "framer-motion";
import API from "../../api/axios";
import Card from "../../components/Card";
import { useAuth } from "../../context/AuthContext";
import Leaderboard from "../../components/Leaderboard";

export default function StudentQuizResult() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const isTrial = searchParams.get("trial") === "true";

  const navigate = useNavigate();
  const { user } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH RESULT (POLICY SAFE)
  ========================== */
  useEffect(() => {
    if (!user) return;

    const fetchResult = async () => {
      try {
        if (isTrial) {
          // 🆓 FREE TRIAL → ModelAttempt based
          const { data } = await API.get(
            `/results/attempt/${quizId}?trial=true`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          setResult({
            totalQuestions: data.totalQuestions,
            correctAnswers: data.correct,
            percentage: data.percentage,
            isTrial: true,
          });
        } else {
          // 🔐 FULL QUIZ → Result based
          const { data } = await API.get("/results", {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const quizResult = data.find(
            (r) => r.quiz && r.quiz._id === quizId
          );

          setResult(quizResult || null);
        }
      } catch (err) {
        console.error("❌ Failed to load result", err);
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [quizId, user, isTrial]);

  /* =========================
     UI STATES
  ========================== */
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading result...
      </p>
    );
  }

if (!result) {
  return (
    <div className="text-center mt-20">
      <p className="text-orange-500 font-semibold mb-4">
        ⚠️ Full result not found.
      </p>

      <button
        onClick={() =>
          navigate(`/student/result/${quizId}?trial=true`)
        }
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        View Trial Result
      </button>
    </div>
  );
}


  const correct =
    result.correctAnswers ?? result.score ?? 0;
  const total = result.totalQuestions ?? 0;
  const percentage = Math.round(result.percentage ?? 0);
  const isPass = percentage >= 40;

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      {/* 🎯 RESULT CARD */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          <Card>
            <div className="text-center">
              <h1
                className={`text-3xl font-bold ${
                  isPass
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {isPass
                  ? "🎉 Congratulations!"
                  : "😢 Try Again"}
              </h1>

              <p className="text-gray-500 mt-2">
                Quiz Result Summary{" "}
                {isTrial && (
                  <span className="text-orange-500">
                    (Free Trial)
                  </span>
                )}
              </p>
            </div>

            <div className="flex justify-center mt-6">
              <div
                className={`w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold 
                ${
                  isPass
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {percentage}%
              </div>
            </div>

            <div className="mt-6 space-y-2 text-center text-gray-700">
              <p>
                ✅ Correct: <strong>{correct}</strong>
              </p>
              <p>
                ❌ Wrong:{" "}
                <strong>{total - correct}</strong>
              </p>
              <p>
                📊 Total Questions:{" "}
                <strong>{total}</strong>
              </p>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() =>
                  navigate("/student/dashboard")
                }
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded"
              >
                Dashboard
              </button>

              {!isTrial && (
                <button
                  onClick={() =>
                    navigate(`/student/quiz/${quizId}`)
                  }
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                >
                  Retry Quiz
                </button>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* 🏆 LEADERBOARD (FULL QUIZ ONLY) */}
      {!isTrial && (
        <div className="max-w-2xl mx-auto mt-10">
          <Leaderboard quizId={quizId} />
        </div>
      )}

      {/* ❌ WRONG ANSWER BUTTON (ALWAYS ALLOWED) */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() =>
             navigate(
      `/student/result/${quizId}/explanations${
        result?.isTrial ? "?trial=true" : ""
      }`
    )
          }
          className="bg-indigo-600 text-white py-2 px-6 rounded"
        >
          ❌ View Wrong Answers
        </button>
      </div>
    </div>
  );
}
