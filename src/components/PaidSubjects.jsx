import { useEffect, useState } from "react";
import API from "../api/axios";

const SUBJECT_META = {
  "বাংলা ১ম": "📘",
  "বাংলা ২য়": "📕",
  "ইংরেজি": "📗",
  "গণিত": "➗",
  "পদার্থবিজ্ঞান": "⚛️",
  "রসায়ন": "🧪",
  "জীববিজ্ঞান": "🧬",
  "বাংলাদেশ ও বিশ্বপরিচয়": "🌍",
  "ইসলাম শিক্ষা": "🕌",
};

export default function PaidSubjects({ classLevel, onSelectSubject }) {
  const [subjects, setSubjects] = useState([]);
  const [unlockedSubjects, setUnlockedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classLevel) return;

    const fetchData = async () => {
      try {
        const [subRes, purchasedRes] = await Promise.all([
          API.get(`/quizzes/paid/subjects?classLevel=${classLevel}`),
          API.get(`/subjects/purchased?classLevel=${classLevel}`),
        ]);

        setSubjects(subRes.data);
        setUnlockedSubjects(purchasedRes.data); // ["বাংলা", "গণিত"]
      } catch (err) {
        console.error("PaidSubjects error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [classLevel]);

  if (loading) {
    return (
      <p className="text-center text-gray-500 mt-8">
        Loading subjects...
      </p>
    );
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-center mt-6 mb-4">
        📚 Subjects (Class {classLevel})
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {subjects.map((sub) => {
          const unlocked = unlockedSubjects.includes(sub);

          return (
            <button
              key={sub}
              onClick={() => onSelectSubject(sub)}
              className={`p-4 rounded-xl shadow transition 
                flex flex-col items-center gap-2
                ${unlocked ? "bg-green-50" : "bg-white hover:shadow-lg"}`}
            >
              <span className="text-3xl">
                {SUBJECT_META[sub] || "📚"}
              </span>

              <span className="font-semibold text-gray-800 text-center">
                {sub}
              </span>

              <span
                className={`text-xs font-semibold ${
                  unlocked ? "text-green-600" : "text-red-500"
                }`}
              >
                {unlocked ? "✅ Subject Unlocked" : "🔒 Locked"}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        🆓 প্রতিটি বিষয়ে ফ্রি ট্রায়াল রয়েছে।  
        💰 একবার কিনলেই পুরো বিষয় আনলক।
      </p>
    </>
  );
}
