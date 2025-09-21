/* eslint-disable @typescript-eslint/no-explicit-any */
// User interface matching the backend User model
export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "job_seeker" | "employer" | "admin";
  isEmailVerified: boolean;
  provider: "local" | "google";
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

// Auth response from backend
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  error?: {
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

// User registration input
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "job_seeker" | "employer";
}

// User login input
export interface LoginInput {
  email: string;
  password: string;
}

// Update profile input
export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
}

// Change password input
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Generic API error response
export interface ApiError {
  success: false;
  error: {
    message: string;
    details?: Array<{
      field: string;
      message: string;
      type?: string;
    }>;
  };
}

// API success response for user data
export interface UserResponse {
  success: true;
  data: User;
}

// Generic API success response
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginInput) => void;
  register: (data: RegisterInput) => void;
  logout: () => void;
  updateProfile: (data: UpdateProfileInput) => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  isUpdatingProfile: boolean;
  loginError: ApiError | null;
  registerError: ApiError | null;
  updateProfileError: ApiError | null;
  clearErrors: () => void;
}

// Route protection props
export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "job_seeker" | "employer" | "admin";
  fallback?: React.ReactNode;
}

// Legacy interfaces for backward compatibility
export type IUser = User;
export type IAuthResponse = AuthResponse;
export type IRegisterInput = RegisterInput;
export type ILoginInput = LoginInput;
export type IApiError = ApiError;
