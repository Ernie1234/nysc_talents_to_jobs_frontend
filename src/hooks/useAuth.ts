import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type {
  IAuthResponse,
  IUser,
  ILoginInput,
  IRegisterInput,
  IApiError,
} from "../types/auth";

// Auth API functions
const authApi = {
  register: async (data: IRegisterInput): Promise<IAuthResponse> => {
    const response = await api.post<IAuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: ILoginInput): Promise<IAuthResponse> => {
    const response = await api.post<IAuthResponse>("/auth/login", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<{ success: true; data: IUser }> => {
    const response = await api.get<{ success: true; data: IUser }>("/auth/me");
    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/logout");
    return response.data;
  },
};

export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    // error: userError, // Removed as it is not used
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!localStorage.getItem("auth-token"),
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user-data", JSON.stringify(data.user));
        queryClient.setQueryData(["currentUser"], {
          success: true,
          data: data.user,
        });
      }
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Registration failed:", error.message);
      } else {
        console.error("Registration failed:", error);
      }
      console.error("Registration failed:", error);
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user-data", JSON.stringify(data.user));
        queryClient.setQueryData(["currentUser"], {
          success: true,
          data: data.user,
        });
      }
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Login failed:", error.message);
      } else {
        console.error("Login failed:", error);
      }
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("auth-token");
      localStorage.removeItem("user-data");
      queryClient.clear();
      window.location.href = "/auth/login";
    },
  });

  return {
    user: currentUser?.data,
    isAuthenticated: !!currentUser?.data,
    isLoading: isLoadingUser,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error as IApiError,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error as IApiError,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
