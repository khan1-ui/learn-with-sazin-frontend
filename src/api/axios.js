import axios from "axios";

/* =========================
   API BASE CONFIG
========================= */
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
API.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("auth");
      const auth = stored ? JSON.parse(stored) : null;

      if (auth?.token) {
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch {
      localStorage.removeItem("auth");
    }

    return config;
  },
  (error) => Promise.reject(error)
);


export default API;
