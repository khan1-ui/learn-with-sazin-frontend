import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import API from "../../api/axios";

export default function WrongAnswerExplanation() {
  const { quizId } = useParams();
  const [searchParams] = useSearchParams();
  const isTrial = searchParams.get("trial") === "true";

  const navigate = useNavigate();

  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH WRONG ANSWERS
     (POLICY SAFE)
  ========================== */
  useEffect(() => {
    const fetchWrongAnswers = async () => {
      try {
  const endpoint = `/results/${quizId}/explanations${isTrial ? "?trial=true" : ""}`;


const { data } = await API.get(endpoint);


        setWrongAnswers(data.data || []);
      } catch (err) {
        console.error(
          "❌ Failed to load wrong answers",
          err
        );
        setWrongAnswers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWrongAnswers();
  }, [quizId, isTrial]);

  /* =========================
     UI STATES
  ========================== */
  if (loading) {
    return (
      <p className="text-center mt-20 text-gray-500">
        Loading wrong answers...
      </p>
    );
  }

  if (wrongAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-green-600 font-semibold text-lg mb-4">
          🎉 কোনো ভুল উত্তর নেই!
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          ⬅ Back
        </button>
      </div>
    );
  }

  /* =========================
     RENDER
  ========================== */
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-600 text-center">
          ❌ Wrong Answer Review{" "}
          {isTrial && (
            <span className="text-sm text-orange-500">
              (Free Trial)
            </span>
          )}
        </h1>

       {wrongAnswers.map((q, index) => (
  <div
    key={index}
    className="bg-white shadow rounded p-5 mb-4"
  >
    <h3 className="font-semibold mb-3">
      Q{index + 1}. {q.question}
    </h3>

<ul className="space-y-2">
  {(q.options || []).map((opt, i) => {
    let style = "bg-gray-100";

    if (i === q.correctAnswer) {
      style = "bg-green-200 border border-green-500";
    }

    if (
      i === q.selectedOption &&
      i !== q.correctAnswer
    ) {
      style = "bg-red-200 border border-red-500";
    }

    return (
      <li key={i} className={`p-2 rounded ${style}`}>
        {opt}
      </li>
    );
  })}
</ul>



    {q.explanation && (
      <p className="mt-3 text-sm bg-blue-50 p-2 rounded">
        📖 <b>Explanation:</b> {q.explanation}
      </p>
    )}
  </div>
))}


        {/* ACTIONS */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-200 px-4 py-2 rounded"
          >
            ⬅ Back to Result
          </button>

          {isTrial && (
            <button
              onClick={() =>
                navigate("/student/dashboard")
              }
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              🔓 Unlock Full Model
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
