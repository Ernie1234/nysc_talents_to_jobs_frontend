import { apiClient } from "@/app/api-client";
import type {
  AnalysisResponse,
  CreateJobRequest,
  CreateJobResponse,
  IJob,
  JobQueryParams,
  JobsResponse,
} from "./jobTypes";

export const jobApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new job
    createJob: builder.mutation<CreateJobResponse, CreateJobRequest>({
      query: (jobData) => ({
        url: "/jobs",
        method: "POST",
        body: jobData,
      }),
      invalidatesTags: ["Jobs", "PublicJobs"],
    }),

    // Get employer's jobs
    getEmployerJobs: builder.query<JobsResponse, JobQueryParams>({
      query: (params) => ({
        url: "/jobs",
        method: "GET",
        params: {
          status: params.status,
          page: params.page || 1,
          limit: params.limit || 10,
          search: params.search,
          jobType: params.jobType,
          experienceLevel: params.experienceLevel,
          workLocation: params.workLocation,
        },
      }),
      providesTags: ["Jobs", "PublicJobs"],
    }),

    // Get a single job
    getJob: builder.query<
      { success: boolean; message: string; data: IJob },
      string
    >({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Jobs", id }],
    }),

    // Update a job
    updateJob: builder.mutation<
      CreateJobResponse,
      // The update request payload expects a 'jobId' and an 'updates' object
      { jobId: string; updates: Partial<CreateJobRequest> }
    >({
      query: ({ jobId, updates }) => ({
        url: `/jobs/${jobId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { jobId }) => [
        { type: "Jobs", id: jobId },
        "Jobs",
        "PublicJobs",
      ],
    }),

    // Publish a job
    publishJob: builder.mutation<CreateJobResponse, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: "Jobs", id: jobId },
        "Jobs",
        "PublicJobs",
      ],
    }),

    // Close a job
    closeJob: builder.mutation<CreateJobResponse, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: "Jobs", id: jobId },
        "Jobs",
        "PublicJobs",
      ],
    }),

    // Delete a job
    deleteJob: builder.mutation<{ success: boolean; message: string }, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Jobs"],
    }),
    getEmployerAnalysis: builder.query<AnalysisResponse, void>({
      query: () => ({
        url: "/jobs/analysis",
        method: "GET",
      }),
      providesTags: ["Analysis", "Jobs"],
    }),
    getPublicJobs: builder.query<JobsResponse, JobQueryParams>({
      query: (params) => ({
        url: "/jobs/users",
        method: "GET",
        params: {
          page: params.page || 1,
          limit: params.limit || 12,
          search: params.search,
          jobType: params.jobType,
          experienceLevel: params.experienceLevel,
          workLocation: params.workLocation,
        },
      }),
      providesTags: ["PublicJobs", "Jobs"],
    }),
    getPublicJobDetails: builder.query<
      { success: boolean; message: string; data: IJob },
      string
    >({
      query: (jobId) => ({
        url: `/jobs/${jobId}/users`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "PublicJobs", id }],
    }),
    updateJobViewCount: builder.mutation<
      { success: boolean; message: string; data: IJob },
      string
    >({
      query: (jobId) => ({
        url: `/jobs/${jobId}/users/view-count`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, jobId) => [
        { type: "PublicJobs", id: jobId },
        "PublicJobs",
        "Jobs",
      ],
    }),
    applyToJob: builder.mutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { success: boolean; message: string; data: any },
      {
        jobId: string;
        documentId?: string;
        resumeUploadId?: string;
        coverLetter?: string;
      }
    >({
      query: ({ jobId, ...applicationData }) => ({
        url: `/jobs/${jobId}/apply`,
        method: "POST",
        body: applicationData,
      }),
      invalidatesTags: ["Applications", "Jobs", "PublicJobs"],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetEmployerJobsQuery,
  useGetJobQuery,
  useUpdateJobMutation,
  usePublishJobMutation,
  useCloseJobMutation,
  useDeleteJobMutation,
  useGetEmployerAnalysisQuery,
  useGetPublicJobsQuery,
  useGetPublicJobDetailsQuery,
  useUpdateJobViewCountMutation,
  useApplyToJobMutation,
} = jobApi;
