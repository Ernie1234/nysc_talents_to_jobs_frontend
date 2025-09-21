import axios from "axios";

const API_URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_PUBLIC_API_URL
    : import.meta.env.VITE_PUBLIC_API_URL_DEV || "http://localhost:5000";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api/V1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user-data");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
