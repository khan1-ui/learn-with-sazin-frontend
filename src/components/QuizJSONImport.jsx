import API from "../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

function QuizJSONImport({ onImported }) {
  const { token, role } = useAuth(); // ✅ SINGLE SOURCE

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // ---------- ROLE CHECK ----------
      if (role !== "teacher") {
        toast.error("❌ Teacher access only");
        return;
      }

      // ---------- READ FILE ----------
      const text = await file.text();
      const json = JSON.parse(text);

      // ---------- BASIC JSON VALIDATION ----------
      if (
        !json.title ||
        !json.classLevel ||
        !Array.isArray(json.questions)
      ) {
        toast.error("❌ Invalid quiz JSON structure");
        return;
      }

      // ---------- API CALL ----------
      const { data } = await API.post("/quizzes/import", json);

      toast.success("📂 Quiz imported successfully");
      onImported?.(data.data);
    } catch (err) {
      console.error("JSON import error:", err);

      if (err instanceof SyntaxError) {
        toast.error("❌ Invalid JSON file");
      } else if (err.response?.status === 401) {
        toast.error("❌ Unauthorized");
      } else if (err.response?.status === 403) {
        toast.error("❌ Teacher permission required");
      } else {
        toast.error("❌ Quiz import failed");
      }
    } finally {
      e.target.value = ""; // reset input
    }
  };

  return (
    <div className="my-4">
      <label className="inline-block cursor-pointer bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 transition">
        📂 Import Quiz (JSON)
        <input
          type="file"
          accept=".json"
          onChange={handleFile}
          className="hidden"
        />
      </label>
    </div>
  );
}

export default QuizJSONImport;
