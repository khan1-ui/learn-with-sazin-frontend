// src/components/TeacherQuizBuilder.jsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function TeacherQuizBuilder({ quizId, onQuizSaved, onQuizDeleted, onClose }) {
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const [quiz, setQuiz] = useState({
    title: "",
    duration: 15, // default 15 min
    subject: "",
    classLevel: "",
    questions: [],
  });
  const [loading, setLoading] = useState(false);

  // Load quiz for edit
  useEffect(() => {
    if (!quizId) {
      setQuiz((prev) => ({ ...prev, questions: [] }));
      return;
    }
    const fetchQuiz = async () => {
      try {
        const { data } = await API.get(`/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${teacher.token}` },
        });
        setQuiz(data);
      } catch (err) {
        toast.error("Failed to load quiz");
        console.error(err);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, { questionText: "", options: ["", "", "", ""], correctOption: 0 }],
    }));
  };

  const removeQuestion = (index) => {
    const questions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions });
  };

  const handleQuestionChange = (index, field, value) => {
    const questions = [...quiz.questions];
    if (field === "questionText") questions[index].questionText = value;
    setQuiz({ ...quiz, questions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const questions = [...quiz.questions];
    questions[qIndex].options[oIndex] = value;
    setQuiz({ ...quiz, questions });
  };

  const handleCorrectOptionChange = (qIndex, value) => {
    const questions = [...quiz.questions];
    questions[qIndex].correctOption = Number(value);
    setQuiz({ ...quiz, questions });
  };

  const saveQuiz = async () => {
    if (!quiz.title || !quiz.classLevel || !quiz.subject) {
      return toast.error("Please fill all quiz details");
    }
    setLoading(true);
    try {
      const res = quizId
        ? await API.put(`/quizzes/${quizId}`, quiz, { headers: { Authorization: `Bearer ${teacher.token}` } })
        : await API.post("/quizzes", quiz, { headers: { Authorization: `Bearer ${teacher.token}` } });

      toast.success(quizId ? "✅ Quiz updated successfully" : "🎉 Quiz created successfully");
      onQuizSaved(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Save failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async () => {
    if (!quizId) return;
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await API.delete(`/quizzes/${quizId}`, { headers: { Authorization: `Bearer ${teacher.token}` } });
      onQuizDeleted(quizId);
    } catch (err) {
      toast.error("❌ Failed to delete quiz");
      console.error(err);
    }
  };

  return (
    <motion.div
      className="bg-white shadow-md rounded p-6 mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{quizId ? "✏️ Edit Quiz" : "➕ Create Quiz"}</h2>
        <button onClick={onClose} className="text-red-500 font-bold text-lg">✖</button>
      </div>

      {/* Quiz Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Quiz Title"
          value={quiz.title}
          onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
          className="border p-2 rounded col-span-2"
        />
        <input
          type="number"
          placeholder="Duration (min)"
          value={quiz.duration}
          onChange={(e) => setQuiz({ ...quiz, duration: Number(e.target.value) })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Class Level"
          value={quiz.classLevel}
          onChange={(e) => setQuiz({ ...quiz, classLevel: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={quiz.subject}
          onChange={(e) => setQuiz({ ...quiz, subject: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {/* Questions */}
      {quiz.questions.map((q, qi) => (
        <div key={qi} className="mb-4 p-4 border rounded bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Question {qi + 1}</span>
            <button onClick={() => removeQuestion(qi)} className="text-red-500 text-sm">Remove</button>
          </div>
          <input
            type="text"
            placeholder="Question Text"
            value={q.questionText}
            onChange={(e) => handleQuestionChange(qi, "questionText", e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          {q.options.map((opt, oi) => (
            <input
              key={oi}
              type="text"
              placeholder={`Option ${oi + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(qi, oi, e.target.value)}
              className="w-full border p-2 rounded mb-1"
            />
          ))}
          <select
            value={q.correctOption}
            onChange={(e) => handleCorrectOptionChange(qi, e.target.value)}
            className="w-full border p-2 rounded mt-1"
          >
            {q.options.map((_, oi) => (
              <option key={oi} value={oi}>Correct Option {oi + 1}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-4 mt-4">
        <button onClick={addQuestion} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">+ Add Question</button>
        <button onClick={saveQuiz} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{loading ? "Saving..." : "Save Quiz"}</button>
        {quizId && <button onClick={deleteQuiz} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete Quiz</button>}
      </div>
    </motion.div>
  );
}
