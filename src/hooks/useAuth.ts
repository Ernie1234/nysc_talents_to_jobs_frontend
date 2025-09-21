/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, authHelpers } from "../api/auth";
import type {
  AuthResponse,
  User,
  ApiError,
  UpdateProfileInput,
} from "../types/auth";
import { tokenManager } from "../api/apiClient";

/**
 * Query keys for authentication-related queries
 */
export const authQueryKeys = {
  user: ["auth", "user"] as const,
  profile: (userId: string) => ["auth", "profile", userId] as const,
  all: ["auth"] as const,
};

/**
 * Main authentication hook with comprehensive functionality
 */
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current authenticated user
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: authQueryKeys.user,
    queryFn: authApi.getCurrentUser,
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: authHelpers.isAuthenticated() && !authHelpers.isTokenExpired(),
    select: (data) => data.data, // Extract user data from response
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: AuthResponse) => {
      if (data.success) {
        authHelpers.saveAuthData(data);
        queryClient.setQueryData(authQueryKeys.user, {
          success: true,
          data: data.user,
        });
        // Invalidate and refetch user data
        queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      }
    },
    onError: (error: any) => {
      console.error(
        "Registration failed:",
        error?.response?.data || error.message
      );
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: AuthResponse) => {
      if (data.success) {
        authHelpers.saveAuthData(data);
        queryClient.setQueryData(authQueryKeys.user, {
          success: true,
          data: data.user,
        });
        // Invalidate and refetch all auth-related queries
        queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error?.response?.data || error.message);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear authentication data
      authHelpers.clearAuthData();
      // Clear all cached data
      queryClient.clear();
      // Navigate to login page
      window.location.href = "/auth/login";
    },
    onError: (error: any) => {
      // Even if logout fails on server, clear local data
      console.warn("Logout API call failed, but clearing local data:", error);
      authHelpers.clearAuthData();
      queryClient.clear();
      window.location.href = "/auth/login";
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdateProfileInput;
    }) => authApi.updateProfile(userId, data),
    onSuccess: (data) => {
      // Update cached user data
      queryClient.setQueryData(authQueryKeys.user, data);
      // Update stored user data
      const currentStoredUser = authHelpers.getStoredUser();
      if (currentStoredUser) {
        tokenManager.setUser({ ...currentStoredUser, ...data.data });
      }
    },
    onError: (error: any) => {
      console.error(
        "Profile update failed:",
        error?.response?.data || error.message
      );
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: authApi.changePassword,
    onError: (error: any) => {
      console.error(
        "Password change failed:",
        error?.response?.data || error.message
      );
    },
  });

  return {
    // User data
    user: currentUser,
    isAuthenticated: !!currentUser && authHelpers.isAuthenticated(),
    isLoading: isLoadingUser,
    userError,
    refetchUser,

    // Registration
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error as ApiError | null,
    registerSuccess: registerMutation.isSuccess,

    // Login
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as ApiError | null,
    loginSuccess: loginMutation.isSuccess,

    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // Profile update
    updateProfile: (data: UpdateProfileInput) => {
      if (currentUser) {
        updateProfileMutation.mutate({ userId: currentUser._id, data });
      }
    },
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error as ApiError | null,
    updateProfileSuccess: updateProfileMutation.isSuccess,

    // Change password
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error as ApiError | null,
    changePasswordSuccess: changePasswordMutation.isSuccess,

    // Utility functions
    clearErrors: () => {
      registerMutation.reset();
      loginMutation.reset();
      updateProfileMutation.reset();
      changePasswordMutation.reset();
    },

    // Helper functions
    hasRole: (role: User["role"]) => authHelpers.hasRole(role),
    getUserFullName: () => authHelpers.getUserFullName(),
    isTokenExpired: () => authHelpers.isTokenExpired(),
  };
};

/**
 * Hook for handling Google OAuth authentication
 */
export const useGoogleAuth = () => {
  const queryClient = useQueryClient();

  const handleGoogleAuthSuccess = (token: string) => {
    if (token) {
      // Save token
      tokenManager.setToken(token);
      // Invalidate queries to refetch user data
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all });
      // Navigate to dashboard or intended page
      const intendedPath =
        sessionStorage.getItem("intended-path") || "/dashboard";
      sessionStorage.removeItem("intended-path");
      window.location.href = intendedPath;
    }
  };

  const handleGoogleAuthError = (error: string) => {
    console.error("Google OAuth error:", error);
    // Show error message to user
    const errorMessages: Record<string, string> = {
      authentication_failed: "Google authentication failed. Please try again.",
      oauth_failed: "OAuth process failed. Please try again.",
      server_error: "Server error occurred. Please try again later.",
    };

    const message =
      errorMessages[error] || "Authentication failed. Please try again.";
    // You can integrate with your notification system here
    alert(message);
  };

  return {
    handleGoogleAuthSuccess,
    handleGoogleAuthError,
  };
};

export default useAuth;
