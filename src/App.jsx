import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ========= STUDENT PAGES ========= */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreateProfile from "./pages/auth/CreateProfile";
import Profile from "./pages/student/Profile";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentQuizAttempt from "./pages/student/StudentQuizAttempt";
import StudentQuizResult from "./pages/student/StudentQuizResult";
import StudentMCQStart from "./pages/student/StudentMCQStart";
import WrongAnswerExplanation from "./pages/student/WrongAnswerExplanation";


/* ========= TEACHER PAGES ========= */
import TeacherLogin from "./pages/teacher/TeacherLogin";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherCreateProfile from "./pages/teacher/TeacherCreateProfile";
import TeacherEditProfile from "./pages/teacher/TeacherEditProfile";
import AdminPriceManager from "./pages/teacher/AdminPriceManager";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFail from "./pages/payment/PaymentFail";



/* ========= ROUTE GUARDS ========= */
import ProtectedRoute from "./components/ProtectedRoute";
import { TeacherProtectedRoute } from "./components/TeacherProtectedRoute";

/* =========================
   ROOT REDIRECT (SMART)
========================= */
const RootRedirect = () => {
  const { isAuthenticated, role, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === "student") {
    if (user?.profileCompleted === false) {
      return <Navigate to="/profile/create" replace />;
    }
    return <Navigate to="/student/dashboard" replace />;
  }

  if (role === "teacher") {
    if (user?.profileCompleted === false) {
      return <Navigate to="/teacher/profile/create" replace />;
    }
    return <Navigate to="/teacher/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
};

/* =========================
   APP
========================= */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ===== ROOT ===== */}
          <Route path="/" element={<RootRedirect />} />

          {/* ===== STUDENT AUTH ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/profile/create"
            element={
              <ProtectedRoute profileRequired={false}>
                <CreateProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
                 <Route path="/payment-success" element={<PaymentSuccess />} />
                 <Route path="/payment-failed" element={<PaymentFail />} />

          <Route
            path="/student/mcq/:mcqId/start"
            element={
              <ProtectedRoute profileRequired={false}>
                <StudentMCQStart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/student/quiz/:quizId"
            element={
              <ProtectedRoute>
                <StudentQuizAttempt />
              </ProtectedRoute>
            }
          />

          <Route
              path="/student/result/:quizId/explanations"
              element={
                <ProtectedRoute>
                  <WrongAnswerExplanation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/student/result/:quizId"
              element={
                <ProtectedRoute>
                  <StudentQuizResult />
                </ProtectedRoute>
              }
            />



          {/* ===== TEACHER AUTH ===== */}
          <Route path="/teacher/login" element={<TeacherLogin />} />

          <Route
            path="/teacher/profile/create"
            element={
              <TeacherProtectedRoute allowProfileCreation>
                <TeacherCreateProfile />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/teacher/profile/edit"
            element={
              <TeacherProtectedRoute allowProfileCreation>
                <TeacherEditProfile />
              </TeacherProtectedRoute>
            }
          />
          <Route
            path="/teacher/prices"
            element={
              <TeacherProtectedRoute >
                <AdminPriceManager />
              </TeacherProtectedRoute>
            }
          />

          <Route
            path="/teacher/dashboard"
            element={
              <TeacherProtectedRoute>
                <TeacherDashboard />
              </TeacherProtectedRoute>
            }
          />

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
