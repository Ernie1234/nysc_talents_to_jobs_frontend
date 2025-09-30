import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  // dont forget to remove the public from the url in production
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const auth = (getState() as RootState).auth;
    if (auth?.accessToken) {
      headers.set("Authorization", `Bearer ${auth.accessToken}`);
    }
    return headers;
  },
});

export const apiClient = createApi({
  reducerPath: "api", // Add API client reducer to root reducer
  baseQuery: baseQuery,
  refetchOnMountOrArgChange: true, // Refetch on mount or arg change
  tagTypes: [
    "Jobs",
    "documents",
    "billingSubscription",
    "Resumes",
    "Analysis",
    "Applications",
    "ApplicationAnalysis",
    "PublicJobs",
  ], // Tag types for RTK Query
  endpoints: () => ({}), // Endpoints for RTK Query
});
