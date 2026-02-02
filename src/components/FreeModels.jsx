import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function FreeModels({ classLevel }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!classLevel) return;

    const fetchModels = async () => {
      try {
        const { data } = await API.get(
          `/quizzes/free?classLevel=${classLevel}`
        );
        setModels(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load free models");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [classLevel]);

  if (loading) {
    return <p className="text-center mt-6 text-gray-500">Loading free models...</p>;
  }

  if (models.length === 0) {
    return (
      <p className="text-center mt-6 text-gray-500">
        No free models available for Class {classLevel}
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center mt-6">
      {models.map((quiz, index) => (
        <button
          key={quiz._id}
          onClick={() => navigate(`/student/quiz/${quiz._id}`)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700"
        >
          Model {index + 1}
        </button>
      ))}
    </div>
  );
}
