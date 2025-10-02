/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/app/api-client";
import type {
  AttendanceResponse,
  CourseResponse,
  CoursesResponse,
  CreateCourseRequest,
  QrSessionResponse,
} from "./courseTypes";

export const courseApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new course (Staff only)
    createCourse: builder.mutation<CourseResponse, CreateCourseRequest>({
      query: (courseData) => ({
        url: "/courses",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Get staff courses (Staff only)
    getStaffCourses: builder.query<CoursesResponse, any>({
      query: (params = {}) => {
        // Convert page and limit to numbers
        const queryParams: any = {};

        if (params.page) queryParams.page = Number(params.page);
        if (params.limit) queryParams.limit = Number(params.limit);
        if (params.status) queryParams.status = params.status;
        if (params.search) queryParams.search = params.search;

        return {
          url: "/courses/staff",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Courses"],
    }),

    // Get all published courses (For Corps members)
    // In your courseAPI.ts - this should now work
    getPublishedCourses: builder.query<CoursesResponse, any>({
      query: (params = {}) => {
        const queryParams: any = {};

        if (params.page) queryParams.page = Number(params.page);
        if (params.limit) queryParams.limit = Number(params.limit);
        if (params.search) queryParams.search = params.search;

        return {
          url: "/courses",
          method: "GET",
          params: queryParams,
        };
      },
      providesTags: ["Courses"],
    }),

    // Get a single course
    getCourse: builder.query<CourseResponse, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Courses", id }],
    }),

    // Update a course (Staff only)
    updateCourse: builder.mutation<
      CourseResponse,
      { courseId: string; updates: Partial<CreateCourseRequest> }
    >({
      query: ({ courseId, updates }) => ({
        url: `/courses/${courseId}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: (_result, _error, { courseId }) => [
        { type: "Courses", id: courseId },
        "Courses",
      ],
    }),

    // Enroll in a course (Corps members only)
    enrollCourse: builder.mutation<CourseResponse, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/enroll`,
        method: "POST",
      }),
      invalidatesTags: ["Courses"],
    }),

    // Generate QR session (Staff only) - FIXED: Include courseId in the body
    generateQrSession: builder.mutation<
      QrSessionResponse,
      { courseId: string; duration?: number }
    >({
      query: ({ courseId, duration }) => ({
        url: `/courses/${courseId}/generate-qr`,
        method: "POST",
        body: {
          courseId, // Include courseId in the request body
          duration,
        },
      }),
      invalidatesTags: ["Courses"],
    }),

    // Scan QR attendance (Corps members only)
    scanQrAttendance: builder.mutation<
      CourseResponse,
      { sessionCode: string; location?: any }
    >({
      query: ({ sessionCode, location }) => ({
        url: "/courses/scan-attendance",
        method: "POST",
        body: { sessionCode, location },
      }),
      invalidatesTags: ["Courses"],
    }),

    // Get course attendance (Staff only)
    getCourseAttendance: builder.query<AttendanceResponse, string>({
      query: (courseId) => ({
        url: `/courses/${courseId}/attendance`,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetStaffCoursesQuery,
  useGetPublishedCoursesQuery,
  useGetCourseQuery,
  useUpdateCourseMutation,
  useEnrollCourseMutation,
  useGenerateQrSessionMutation,
  useScanQrAttendanceMutation,
  useGetCourseAttendanceQuery,
} = courseApi;
