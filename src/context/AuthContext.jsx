import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem("auth");
      return stored ? JSON.parse(stored) : null;
    } catch {
      localStorage.removeItem("auth");
      return null;
    }
  });

  /* =========================
     SYNC TO LOCALSTORAGE
  ========================== */
  useEffect(() => {
    if (auth) {
      localStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth]);

  /* =========================
     LOGIN (ALWAYS RESET FIRST)
  ========================== */
  const login = (authData) => {
    if (!authData?.token || !authData?.user) return;

    // 🔥 reset any old state
    localStorage.removeItem("auth");

    setAuth(authData);
    localStorage.setItem("auth", JSON.stringify(authData));
  };

  /* =========================
     UPDATE USER
  ========================== */
  const updateUser = (updates) => {
    setAuth((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        user: {
          ...prev.user,
          ...updates,
        },
      };

      localStorage.setItem("auth", JSON.stringify(updated));
      return updated;
    });
  };

  /* =========================
     COMPLETE PROFILE
  ========================== */
  const completeProfile = (profileData) => {
    if (!profileData || typeof profileData !== "object") return;
    updateUser(profileData);
  };

  /* =========================
     LOGOUT (HARD RESET)
  ========================== */
  const logout = () => {
    setAuth(null);

    // 🔥 clear EVERYTHING
    localStorage.removeItem("auth");
    localStorage.removeItem("teacher");
    localStorage.removeItem("teacherToken");
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        login,
        logout,
        updateUser,
        completeProfile,

        isAuthenticated: Boolean(auth?.token),
        user: auth?.user || null,
        token: auth?.token || null,
        role: auth?.user?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
