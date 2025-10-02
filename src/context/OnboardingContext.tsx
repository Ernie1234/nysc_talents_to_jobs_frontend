// src/contexts/OnboardingContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGetOnboardingProgressQuery } from "@/features/onboardings/onboardingAPI";

interface OnboardingContextType {
  showOnboarding: boolean;
  currentStep: number;
  isLoading: boolean;
  closeOnboarding: () => void;
  markAsCompleted: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { data: progressResponse, isLoading } = useGetOnboardingProgressQuery(
    undefined,
    {
      skip:
        !isAuthenticated ||
        !user ||
        !["CORPS_MEMBER", "SIWES"].includes(user.role),
    }
  );

  // Extract the actual progress data from the API response
  const progressData = progressResponse?.data;

  useEffect(() => {
    if (
      progressData &&
      !progressData.onboardingCompleted &&
      ["CORPS_MEMBER", "SIWES"].includes(user?.role || "")
    ) {
      setShowOnboarding(true);
      setCurrentStep(progressData.onboardingStep || 1);
    } else {
      setShowOnboarding(false);
    }
  }, [progressData, user]);

  const closeOnboarding = () => {
    setShowOnboarding(false);
  };

  const markAsCompleted = () => {
    setShowOnboarding(false);
  };

  return (
    <OnboardingContext.Provider
      value={{
        showOnboarding,
        currentStep: currentStep || 1, // Ensure it's never undefined
        isLoading,
        closeOnboarding,
        markAsCompleted,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider");
  }
  return context;
};
