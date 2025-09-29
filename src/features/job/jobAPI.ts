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
      invalidatesTags: ["Jobs"],
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
      providesTags: ["Jobs"],
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
      providesTags: (result, error, id) => [{ type: "Jobs", id }],
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
      invalidatesTags: (result, error, { jobId }) => [
        { type: "Jobs", id: jobId },
        "Jobs",
      ],
    }),

    // Publish a job
    publishJob: builder.mutation<CreateJobResponse, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, jobId) => [
        { type: "Jobs", id: jobId },
        "Jobs",
      ],
    }),

    // Close a job
    closeJob: builder.mutation<CreateJobResponse, string>({
      query: (jobId) => ({
        url: `/jobs/${jobId}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, jobId) => [
        { type: "Jobs", id: jobId },
        "Jobs",
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
} = jobApi;
