import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import BuySubjectModal from "./BuySubjectModal";

/* =========================
   HELPERS
========================= */

// বাংলা digit map


export default function PaidModels({ classLevel, subject }) {
  const navigate = useNavigate();
const handleFreeTrial = async (quizId) => {
  try {
    navigate(`/student/mcq/${quizId}/start?trial=true`);
  } catch (err) {
    if (err.response?.data?.code === "TRIAL_USED") {
      alert("⚠️ এই MCQ-এর ফ্রি ট্রায়াল ইতিমধ্যে ব্যবহার করা হয়েছে");
    } else {
      alert("কিছু সমস্যা হয়েছে, আবার চেষ্টা করো");
    }
  }
};

  const [mcqs, setMcqs] = useState([]);
  const [subjectUnlocked, setSubjectUnlocked] = useState(false);
  const [completedMap, setCompletedMap] = useState({});
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA (MCQ + PURCHASE + RESULTS)
  ========================== */
  useEffect(() => {
    if (!classLevel || !subject) return;

    const fetchData = async () => {
      try {
        const [mcqRes, unlockedRes, resultRes] = await Promise.all([
          API.get(
            `/quizzes/paid/models?classLevel=${classLevel}&subject=${subject}`
          ),
          API.get(
            `/purchase/check?classLevel=${classLevel}&subject=${subject}`
          ),
          API.get("/results"), // 🔥 completed detect
        ]);

        setMcqs(mcqRes.data);
        setSubjectUnlocked(unlockedRes.data.unlocked);

        // Build completed map (quizId → result)
        const map = {};
        resultRes.data.forEach((r) => {
          if (r.quiz?._id) {
            map[r.quiz._id] = r;
          }
        });
        setCompletedMap(map);
      } catch (err) {
        console.error("PaidModels error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classLevel, subject]);

  /* =========================
     UI STATES
  ========================== */
  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Loading MCQs...
      </p>
    );
  }

  return (
    <>
      {/* ===== SUBJECT STATUS ===== */}
      <div className="mb-6 text-center">
        {subjectUnlocked ? (
          <p className="text-green-600 font-semibold">
            ✅ এই বিষয়টি আনলক করা আছে। নিশ্চিন্তে প্র্যাকটিস করো।
          </p>
        ) : (
          <p className="text-red-500 text-sm">
            🔒 Locked subject • ফ্রি ট্রায়াল দিয়ে শুরু করো
          </p>
        )}
      </div>

      {/* ===== MCQ GRID ===== */}
      <div className="grid md:grid-cols-3 gap-6">
        {mcqs.map((mcq, index) => {
          const completed = !!completedMap[mcq._id];

          return (
            <div
              key={mcq._id}
              className="bg-white rounded-xl shadow p-6 flex flex-col justify-between"
            >
          
              {completed && (
                <span className="inline-block mb-2 text-xs font-semibold 
                  bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  ✅ Completed
                </span>
              )}

              {/* TITLE */}
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {mcq.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {mcq.subject} • Class {classLevel}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-6 space-y-2">
                {/* 🆓 Free Trial */}
                <button
                 onClick={() => handleFreeTrial(mcq._id)}
                  className="w-full bg-gray-200 hover:bg-gray-300 py-2 rounded"
                >
                  ▶️ Free Trial
                </button>

                {/* 🔐 Paid Logic */}
                {subjectUnlocked && !completed && (
                  <button
                    onClick={() =>
                      navigate(`/student/mcq/${mcq._id}/start`)
                    }
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                  >
                    ▶️ Start MCQ
                  </button>
                )}

                {/* ✅ Completed Actions */}
                {completed && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/student/result/${mcq._id}`)
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                    >
                      📊 View Result
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/student/mcq/${mcq._id}/start`)
                      }
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                    >
                      🔁 Retry MCQ
                    </button>
                  </>
                )}

                {/* 🔒 Locked */}
                {!subjectUnlocked && (
                  <button
                    onClick={() => setShowBuyModal(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded"
                  >
                    💳 Unlock Full Subject
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== BUY SUBJECT MODAL ===== */}
      {showBuyModal && (
        <BuySubjectModal
          subject={subject}
          classLevel={classLevel}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {
            setSubjectUnlocked(true);
            setShowBuyModal(false);
          }}
        />
      )}
    </>
  );
}
