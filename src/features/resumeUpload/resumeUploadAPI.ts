import { apiClient } from "@/app/api-client";

export const resumeUploadApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Upload resume
    uploadResume: builder.mutation({
      query: (formData: FormData) => ({
        url: "/resume-uploads/upload",
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      }),
      invalidatesTags: ["Resumes"],
    }),

    // Get user's resumes
    getUserResumes: builder.query({
      query: () => "/resume-uploads",
      providesTags: ["Resumes"],
    }),

    // Get specific resume
    getResumeById: builder.query({
      query: (resumeId: string) => `/resume-uploads/${resumeId}`,
      providesTags: (_result, _error, id) => [{ type: "Resumes", id }],
    }),

    // Delete resume
    deleteResume: builder.mutation({
      query: (resumeId: string) => ({
        url: `/resume-uploads/${resumeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Resumes"],
    }),

    // Download resume
    downloadResume: builder.mutation({
      query: (resumeId: string) => ({
        url: `/resume-uploads/${resumeId}/download`,
        method: "GET",
        responseHandler: (response) => response.blob(),
        cache: "no-cache",
      }),
    }),
  }),
});

export const {
  useUploadResumeMutation,
  useGetUserResumesQuery,
  useGetResumeByIdQuery,
  useDeleteResumeMutation,
  useDownloadResumeMutation,
} = resumeUploadApi;
