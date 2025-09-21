export interface IUser {
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

export interface IAuthResponse {
  success: boolean;
  token: string;
  user: IUser;
  error?: { message: string };
}

export interface IRegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: "job_seeker" | "employer";
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IApiError {
  success: false;
  error: {
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}
