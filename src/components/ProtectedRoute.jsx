import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, profileRequired = true }) => {
  const { isAuthenticated, role, user } = useAuth();

  /* =========================
     AUTH CHECK
  ========================== */
  // 🔐 Not logged in OR not a student
  if (!isAuthenticated || role !== "student") {
    return <Navigate to="/login" replace />;
  }

  /* =========================
     PROFILE CHECK
  ========================== */
  // profileRequired = false → allow profile creation page
  if (profileRequired && user && user.profileCompleted === false) {
    return <Navigate to="/profile/create" replace />;
  }

  /* =========================
     SAFE RENDER
  ========================== */
  return children;
};

export default ProtectedRoute;
