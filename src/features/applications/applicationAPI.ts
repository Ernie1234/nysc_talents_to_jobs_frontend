// features/application/applicationAPI.ts
import { apiClient } from "@/app/api-client";
import type {
  ApplicationAnalysisResponse,
  ApplicationQueryParams,
  ApplicationResponse,
  ApplicationsResponse,
  UpdateApplicationInput,
  UserApplicationsResponse,
} from "./application-types";

export const applicationApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Get staff's applications
    getStaffApplications: builder.query<
      ApplicationsResponse,
      ApplicationQueryParams
    >({
      query: (params) => ({
        url: "/applications/staff",
        method: "GET",
        params: {
          status: params.status,
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          jobId: params.jobId,
        },
      }),
      providesTags: ["Applications"],
    }),

    // Get application analysis
    getApplicationAnalysis: builder.query<ApplicationAnalysisResponse, void>({
      query: () => ({
        url: "/applications/analysis",
        method: "GET",
      }),
      providesTags: ["ApplicationAnalysis", "Applications"],
    }),

    // Get single application
    getApplication: builder.query<ApplicationResponse, string>({
      query: (applicationId) => ({
        url: `/applications/${applicationId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Applications", id }],
    }),

    // Update application status
    updateApplication: builder.mutation<
      ApplicationResponse,
      { applicationId: string; updates: UpdateApplicationInput }
    >({
      query: ({ applicationId, updates }) => ({
        url: `/applications/${applicationId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { applicationId }) => [
        { type: "Applications", id: applicationId },
        "Applications",
        "ApplicationAnalysis",
      ],
    }),

    // Withdraw application (for corps members)
    withdrawApplication: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (applicationId) => ({
        url: `/applications/${applicationId}/withdraw`,
        method: "PATCH",
      }),
      invalidatesTags: ["Applications", "ApplicationAnalysis"],
    }),
    getUserApplications: builder.query<UserApplicationsResponse, void>({
      query: () => ({
        url: "/applications/my-applications",
        method: "GET",
      }),
      providesTags: ["Applications"],
    }),
  }),
});

export const {
  useGetStaffApplicationsQuery,
  useGetApplicationAnalysisQuery,
  useGetApplicationQuery,
  useUpdateApplicationMutation,
  useWithdrawApplicationMutation,
  useGetUserApplicationsQuery,
} = applicationApi;
