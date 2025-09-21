/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  AuthResponse,
  RegisterInput,
  LoginInput,
  UserResponse,
  UpdateProfileInput,
  ChangePasswordInput,
  User,
} from "../types/auth";
import api, { tokenManager } from "./apiClient";

/**
 * Authentication API functions matching the backend endpoints
 */
export const authApi = {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Login user with email and password
   * POST /api/auth/login
   */
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await api.get<UserResponse>("/auth/me");
    return response.data;
  },

  /**
   * Logout current user
   * POST /api/auth/logout
   */
  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response.data;
  },

  /**
   * Update user profile
   * PUT /api/users/:id (assuming this endpoint exists)
   */
  updateProfile: async (
    userId: string,
    data: UpdateProfileInput
  ): Promise<UserResponse> => {
    const response = await api.put<UserResponse>(`/users/${userId}`, data);
    return response.data;
  },

  /**
   * Change user password
   * PUT /api/auth/change-password (assuming this endpoint exists)
   */
  changePassword: async (
    data: ChangePasswordInput
  ): Promise<{ message: string }> => {
    const response = await api.put<{ message: string }>(
      "/auth/change-password",
      data
    );
    return response.data;
  },

  /**
   * Refresh auth token (if backend supports it)
   * POST /api/auth/refresh
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post<{ token: string }>("/auth/refresh");
    return response.data;
  },

  /**
   * Request password reset email
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return response.data;
  },

  /**
   * Reset password with token
   * POST /api/auth/reset-password
   */
  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      {
        token,
        password,
      }
    );
    return response.data;
  },

  /**
   * Verify email with token
   * POST /api/auth/verify-email
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/verify-email", {
      token,
    });
    return response.data;
  },

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  resendVerificationEmail: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      "/auth/resend-verification"
    );
    return response.data;
  },
};

/**
 * Helper functions for authentication state management
 */
export const authHelpers = {
  /**
   * Save authentication data to localStorage
   */
  saveAuthData: (authResponse: AuthResponse): void => {
    if (authResponse.success && authResponse.token) {
      tokenManager.setToken(authResponse.token);
      tokenManager.setUser(authResponse.user);
    }
  },

  /**
   * Clear authentication data from localStorage
   */
  clearAuthData: (): void => {
    tokenManager.removeToken();
  },

  /**
   * Get stored user data
   */
  getStoredUser: (): User | null => {
    return tokenManager.getUser();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!tokenManager.getToken();
  },

  /**
   * Check if user has specific role
   */
  hasRole: (requiredRole: User["role"]): boolean => {
    const user = tokenManager.getUser();
    return user?.role === requiredRole || user?.role === "admin";
  },

  /**
   * Get user's full name
   */
  getUserFullName: (): string => {
    const user = tokenManager.getUser();
    return user ? `${user.firstName} ${user.lastName}` : "";
  },

  /**
   * Parse JWT token payload (basic implementation)
   */
  parseTokenPayload: (token: string): any | null => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  },

  /**
   * Check if token is expired
   */
  isTokenExpired: (): boolean => {
    const token = tokenManager.getToken();
    if (!token) return true;

    const payload = authHelpers.parseTokenPayload(token);
    if (!payload || !payload.exp) return true;

    return Date.now() >= payload.exp * 1000;
  },
};

export default authApi;
