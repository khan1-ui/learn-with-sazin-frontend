import { useEffect, useState } from "react";
import API from "../api/axios";

const CATEGORY_META = {
  Science: "🧪",
  Arts: "📘",
  Commerce: "📊",
};

export default function PaidCategories({ classLevel, onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!classLevel) return;

    const fetchCategories = async () => {
      try {
        const { data } = await API.get(
          `/quizzes/paid/categories?classLevel=${classLevel}`
        );
        setCategories(data);
      } catch (err) {
        console.error("PaidCategories error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [classLevel]);

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading categories...</p>;
  }

  if (categories.length === 0) {
    return <p className="text-center mt-8 text-gray-500">No categories available</p>;
  }

  return (
    <>
      <h2 className="text-xl font-semibold text-center mt-6 mb-4">
        🔐 Paid Trial Categories (Class {classLevel})
      </h2>

      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)} // ✅ FIXED
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg 
                       font-semibold hover:bg-indigo-700 transition"
          >
            <span className="mr-2">{CATEGORY_META[cat] || "📚"}</span>
            {cat}
          </button>
        ))}
      </div>
    </>
  );
}
