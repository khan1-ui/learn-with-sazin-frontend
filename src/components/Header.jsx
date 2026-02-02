import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { auth, logout } = useAuth();
  const [imgLoaded, setImgLoaded] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL;

  /* =========================
     USER SOURCE (SAFE)
  ========================== */
  const user =
    auth?.user ||
    (() => {
      try {
        const stored = localStorage.getItem("auth");
        return stored ? JSON.parse(stored)?.user : null;
      } catch {
        return null;
      }
    })();

  if (!user) return null; // 🟢 safe now (after fallback)

  /* =========================
     AVATAR SOURCE (ROBUST)
  ========================== */
  const avatarSrc = useMemo(() => {
    const avatarPath = user.avatar;

    return avatarPath
      ? `${API_BASE}${avatarPath}?t=${Date.now()}`
      : "/default-avatar.png";
  }, [user.avatar, API_BASE]);

  useEffect(() => {
    setImgLoaded(false);
  }, [avatarSrc]);

  const logoutHandler = () => {
    logout();
    window.location.href =
      user.role === "teacher" ? "/teacher/login" : "/login";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
        {/* ===== BRAND ===== */}
        <Link
          to={
            user.role === "teacher"
              ? "/teacher/dashboard"
              : "/student/dashboard"
          }
          className="text-lg sm:text-xl font-bold text-indigo-600 truncate"
        >
          Learn With Sazin
        </Link>

        {/* ===== RIGHT ===== */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Avatar */}
          <Link
            to={
              user.role === "teacher"
                ? "/teacher/profile/edit"
                : "/profile"
            }
            className="relative"
          >
            {!imgLoaded && (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-200 animate-pulse" />
            )}

            <img
              key={avatarSrc}
              src={avatarSrc}
              alt="avatar"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border ${
                imgLoaded ? "block" : "hidden"
              }`}
            />
          </Link>

          <button
            onClick={logoutHandler}
            className="text-xs sm:text-sm text-gray-500 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
