/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import type { ApiError } from "../types/auth";

// Get API URL based on environment
const getApiUrl = (): string => {
  const isDev =
    import.meta.env.VITE_NODE_ENV === "development" || import.meta.env.DEV;

  if (isDev) {
    return import.meta.env.VITE_PUBLIC_API_URL_DEV || "http://localhost:8080";
  }

  return (
    import.meta.env.VITE_PUBLIC_API_URL ||
    "https://nysc-talent-to-jobs-backend.onrender.com"
  );
};

const API_BASE_URL = getApiUrl();

console.log("🔗 API Base URL:", API_BASE_URL);

// Create axios instance with correct backend endpoint structure
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // Backend uses /api/auth, /api/users etc.
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 18080, // 15 second timeout
});

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return sessionStorage.getItem("nysc-auth-token");
  },

  setToken: (token: string): void => {
    sessionStorage.setItem("nysc-auth-token", token);
  },

  removeToken: (): void => {
    sessionStorage.removeItem("nysc-auth-token");
    sessionStorage.removeItem("nysc-user-data");
  },

  getUser: (): any | null => {
    const userData = sessionStorage.getItem("nysc-user-data");
    return userData ? JSON.parse(userData) : null;
  },

  setUser: (user: any): void => {
    sessionStorage.setItem("nysc-user-data", JSON.stringify(user));
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();

    if (token) {
      // Fix for TypeScript error: 'config.headers' is possibly 'undefined'.
      // We check if headers exist before setting the Authorization header.
      if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🔥 ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle responses and errors
api.interceptors.response.use(
  (response: any) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(
        `✅ ${response.status} ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }

    return response;
  },
  (error) => {
    // Log errors in development
    if (import.meta.env.DEV) {
      console.error(
        `❌ ${error.response?.status} ${error.config?.method?.toUpperCase()} ${
          error.config?.url
        }`,
        error.response?.data
      );
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      tokenManager.removeToken();

      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login?error=session_expired";
      }
    }

    // Handle network errors
    if (!error.response) {
      const networkError: ApiError = {
        success: false,
        error: {
          message: "Network error. Please check your internet connection.",
          details: [],
        },
      };
      return Promise.reject({ response: { data: networkError } });
    }

    // Handle server errors
    if (error.response.status >= 500) {
      const serverError: ApiError = {
        success: false,
        error: {
          message: "Server error. Please try again later.",
          details: [],
        },
      };
      return Promise.reject({ response: { data: serverError } });
    }

    return Promise.reject(error);
  }
);

// Health check function
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
}> => {
  const response = await axios.get<{ status: string; timestamp: string }>(
    `${API_BASE_URL}/health`,
    { timeout: 8080 }
  );
  return response.data;
};

// Google OAuth URL
export const getGoogleOAuthUrl = (): string => {
  return `${API_BASE_URL}/api/auth/google`;
};

export default api;
