import { useNavigate, useLocation } from "react-router-dom";

export default function StudentBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname.startsWith(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40
                    bg-white border-t shadow-md
                    flex justify-around items-center
                    py-2 md:hidden">
      
      <button
        onClick={() => navigate("/student/dashboard")}
        className={`flex flex-col items-center text-xs ${
          isActive("/student/dashboard")
            ? "text-indigo-600"
            : "text-gray-500"
        }`}
      >
        🏠
        <span>Home</span>
      </button>

      <button
        onClick={() => navigate("/student/dashboard")}
        className={`flex flex-col items-center text-xs ${
          isActive("/student/mcq")
            ? "text-indigo-600"
            : "text-gray-500"
        }`}
      >
        📚
        <span>MCQ</span>
      </button>

      <button
        onClick={() => navigate("/student/profile")}
        className={`flex flex-col items-center text-xs ${
          isActive("/student/profile")
            ? "text-indigo-600"
            : "text-gray-500"
        }`}
      >
        👤
        <span>Profile</span>
      </button>
    </div>
  );
}
