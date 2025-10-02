// src/features/onboarding/onboardingAPI.ts
import { apiClient } from "@/app/api-client";

export const onboardingApi = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingProgress: builder.query({
      query: () => "/onboarding/progress",
      providesTags: ["Onboarding"],
    }),
    updateOnboardingStep: builder.mutation({
      query: (data) => ({
        url: "/onboarding/step",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Onboarding"],
    }),
    completeOnboarding: builder.mutation({
      query: (data) => ({
        url: "/onboarding/complete",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Onboarding", "User"],
    }),
  }),
});

export const {
  useGetOnboardingProgressQuery,
  useUpdateOnboardingStepMutation,
  useCompleteOnboardingMutation,
} = onboardingApi;
