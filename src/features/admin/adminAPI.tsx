/* eslint-disable @typescript-eslint/no-explicit-any */
// features/admin/adminAPI.ts
import { apiClient } from "@/app/api-client";

export interface AdminApplication {
  _id: string;
  id: string;
  status:
    | "pending"
    | "under_review"
    | "shortlisted"
    | "interview"
    | "rejected"
    | "accepted"
    | "withdrawn";
  appliedAt: string;
  reviewedAt?: string;
  coverLetter?: string;
  userId: {
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: "CORPS_MEMBER" | "SIWES";
    profile?: {
      status: "ACCEPTED" | "REJECTED" | "SUSPENDED" | "PENDING";
      phoneNumber?: string;
      stateCode?: string;
      callUpNumber?: string;
    };
  };
  jobId: {
    _id: string;
    id: string;
    title: string;
    jobType: string;
    experienceLevel: string;
    workLocation: string;
  };
  staffId: {
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
// features/admin/adminAPI.ts - UPDATED TYPES
export interface AdminUser {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CORPS_MEMBER" | "SIWES" | "STAFF" | "ADMIN";
  onboardingCompleted: boolean;
  onboardingStep?: number;
  isEmailVerified?: boolean;
  profile?: {
    status: "ACCEPTED" | "REJECTED" | "SUSPENDED" | "PENDING";
    phoneNumber?: string;
    stateOfService?: string;
    tertiarySchool?: string;
    stateCode?: string;
    callUpNumber?: string;
    placeOfPrimaryAssignment?: string;
    dateOfBirth?: string;
    gender?: string;
    skills?: Array<{
      name: string;
      level: number;
      _id: string;
    }>;
  };
  staffProfile?: {
    companyName: string;
    companySize: string;
    industry: string;
    companyDescription: string;
    website: string;
    location: string;
  };
  createdAt: string;
  updatedAt: string;
  fullName: string;
  __v?: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  };
}
export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applications: AdminApplication[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface UpdateStatusResponse {
  success: boolean;
  message: string;
  data: AdminApplication | AdminUser;
}

export interface ApplicationQueryParams {
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface UserQueryParams {
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const adminApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get all applications (Admin only)
    getAllApplications: builder.query<
      ApplicationsResponse,
      ApplicationQueryParams
    >({
      query: (params = {}) => ({
        url: "/admin/applications",
        method: "GET",
        params: {
          status: params.status,
          role: params.role,
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search,
        },
      }),
      providesTags: ["AdminApplications"],
    }),

    // Get all users (Admin only)
    getAllUsers: builder.query<UsersResponse, UserQueryParams>({
      query: (params = {}) => ({
        url: "/admin/users",
        method: "GET",
        params: {
          role: params.role,
          status: params.status,
          page: params.page || 1,
          limit: params.limit || 20,
          search: params.search,
        },
      }),
      providesTags: ["AdminUsers"],
    }),

    // Update application status (Admin only)
    updateApplicationStatus: builder.mutation<
      UpdateStatusResponse,
      { applicationId: string; status: string }
    >({
      query: ({ applicationId, status }) => ({
        url: `/admin/applications/${applicationId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdminApplications"],
    }),

    // Update user status (Admin only)
    updateUserStatus: builder.mutation<
      UpdateStatusResponse,
      { userId: string; status: string }
    >({
      query: ({ userId, status }) => ({
        url: `/admin/users/${userId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["AdminUsers"],
    }),

    // Get admin dashboard stats
    getAdminDashboardStats: builder.query<any, void>({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),
  }),
});

export const {
  useGetAllApplicationsQuery,
  useGetAllUsersQuery,
  useUpdateApplicationStatusMutation,
  useUpdateUserStatusMutation,
  useGetAdminDashboardStatsQuery,
} = adminApi;
