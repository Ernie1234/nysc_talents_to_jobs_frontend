import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  user: User | null;
  isAuthenticated: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
  accessToken: string;
  expiresAt: number;
}

interface UserProfile {
  skills: string[];
  phoneNumber?: string;
  stateOfService?: string;
  placeOfPrimaryAssignment?: string;
  bio?: string;
  profilePicture?: string;
  resume?: string;
  linkedin?: string;
  github?: string;
}

interface User {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "corps_member" | "employer" | "admin";
  onboardingCompleted: boolean;
  onboardingStep: number;
  isEmailVerified: boolean;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

const isTokenValid = (
  accessToken: string | null,
  expiresAt: number | null
): boolean => {
  if (!accessToken || !expiresAt) return false;

  // Add a 5-minute buffer to account for clock differences
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return expiresAt > Date.now() + bufferTime;
};

const getInitialAuthState = (): AuthState => {
  const accessToken = localStorage.getItem("accessToken");
  const expiresAtStr = localStorage.getItem("tokenExpiresAt");
  const userStr = localStorage.getItem("user");

  const expiresAt = expiresAtStr ? Number(expiresAtStr) : null;
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = isTokenValid(accessToken, expiresAt);

  return {
    accessToken,
    expiresAt,
    user,
    isAuthenticated,
  };
};

const initialState: AuthState = getInitialAuthState();

console.log("Auth Initialization:", {
  hasToken: !!localStorage.getItem("accessToken"),
  expiresAt: localStorage.getItem("tokenExpiresAt"),
  currentTime: Date.now(),
  isExpired: Number(localStorage.getItem("tokenExpiresAt")) <= Date.now(),
  user: JSON.parse(localStorage.getItem("user") || "null"),
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const { accessToken, expiresAt, data } = action.payload;

      state.accessToken = accessToken;
      state.expiresAt = expiresAt;
      state.user = data.user;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("tokenExpiresAt", expiresAt.toString());
      localStorage.setItem("user", JSON.stringify(data.user));
    },
    // New action for updating tokens only
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; expiresAt: number }>
    ) => {
      const { accessToken, expiresAt } = action.payload;

      state.accessToken = accessToken;
      state.expiresAt = expiresAt;
      state.isAuthenticated = true;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("tokenExpiresAt", expiresAt.toString());
    },
    updateUserCredentials: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenExpiresAt");
      localStorage.removeItem("user");
    },
    checkTokenExpiry: (state) => {
      const isValid = isTokenValid(state.accessToken, state.expiresAt);

      if (!isValid && state.isAuthenticated) {
        // Token expired, logout user
        state.accessToken = null;
        state.expiresAt = null;
        state.user = null;
        state.isAuthenticated = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("tokenExpiresAt");
        localStorage.removeItem("user");

        console.log("Token expired, user logged out");
      } else if (isValid && !state.isAuthenticated) {
        // Token is valid but state wasn't set correctly, fix it
        state.isAuthenticated = true;
        console.log("Fixed authentication state");
      }
    },
    setAuthentication: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});
export const {
  setCredentials,
  updateTokens,
  updateUserCredentials,
  logout,
  checkTokenExpiry,
  setAuthentication,
} = authSlice.actions;
export default authSlice.reducer;
