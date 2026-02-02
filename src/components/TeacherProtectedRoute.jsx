import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * 🔐 Protect routes for logged-in teachers
 */
export const TeacherProtectedRoute = ({
  children,
  allowProfileCreation = false,
}) => {
  const { isAuthenticated, role, user } = useAuth();

  /* =========================
     AUTH CHECK
  ========================== */
  // 🚫 Not logged in OR not a teacher
  if (!isAuthenticated || role !== "teacher") {
    return <Navigate to="/teacher/login" replace />;
  }

  /* =========================
     PROFILE CHECK
  ========================== */
  // allowProfileCreation = true → allow profile create page
  if (!allowProfileCreation && user && user.profileCompleted === false) {
    return <Navigate to="/teacher/profile/create" replace />;
  }

  /* =========================
     SAFE RENDER
  ========================== */
  return children;
};
