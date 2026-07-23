import axios from "axios";

// In dev, Vite proxies /api to the backend (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend URL.
const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // send the http-only JWT cookie on every request
  timeout: 15000, // fail clearly instead of hanging (e.g. if the DB/API isn't configured)
  headers: { "Content-Type": "application/json" },
});

// Normalize error messages so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.code === "ECONNABORTED"
        ? "The server took too long to respond. Please try again."
        : error.response?.data?.message || error.message || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
