/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/onboarding/OnboardingSteps.tsx
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  useCompleteOnboardingMutation,
  useUpdateOnboardingStepMutation,
} from "@/features/onboardings/onboardingAPI";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { DocumentUploadStep } from "./DocumentUploadStep";
import { SkillsStep } from "./SkillsStep";
import { ReviewStep } from "./ReviewStep";

interface OnboardingStepsProps {
  currentStep: number;
  onComplete: () => void;
}

export const OnboardingSteps: React.FC<OnboardingStepsProps> = ({
  currentStep,
  onComplete,
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState(currentStep);
  const [onboardingData, setOnboardingData] = useState({
    personalInfo: {},
    documents: [],
    skills: [],
  });

  const [updateStep] = useUpdateOnboardingStepMutation();
  const [completeOnboarding] = useCompleteOnboardingMutation();

  const steps = [
    { number: 1, title: "Personal Information", component: PersonalInfoStep },
    { number: 2, title: "Document Upload", component: DocumentUploadStep },
    { number: 3, title: "Skills & Interests", component: SkillsStep },
    { number: 4, title: "Review & Complete", component: ReviewStep },
  ];

  const CurrentStepComponent = steps.find((s) => s.number === step)?.component;

  const handleNext = async (stepData: any) => {
    // Merge new data with existing onboarding data
    const updatedData = {
      ...onboardingData,
      ...stepData,
    };
    setOnboardingData(updatedData);

    if (step < 4) {
      // For steps 1-3, update the current step
      const nextStep = step + 1;
      setStep(nextStep);

      try {
        // Prepare data for step update
        const apiData: any = {
          step: nextStep,
        };

        // Only include the data that was just submitted for this step
        if (stepData.personalInfo) {
          apiData.personalInfo = stepData.personalInfo;
        }
        if (stepData.documents) {
          apiData.documents = stepData.documents.map((doc: any) => ({
            ...doc,
            uploadedAt: new Date(doc.uploadedAt).toISOString(),
          }));
        }
        if (stepData.skills) {
          apiData.skills = stepData.skills;
        }

        await updateStep(apiData).unwrap();
      } catch (error) {
        console.error("Failed to update step:", error);
        // Optionally show error toast to user
      }
    } else {
      // For step 4 (Review), complete the onboarding with ALL accumulated data
      try {
        // Prepare complete data for final submission
        const completeData = {
          personalInfo: updatedData.personalInfo,
          documents: updatedData.documents.map((doc: any) => ({
            ...doc,
            uploadedAt: new Date(doc.uploadedAt).toISOString(),
          })),
          skills: updatedData.skills || [],
        };

        console.log("Submitting complete data:", completeData);

        await completeOnboarding(completeData).unwrap();
        onComplete();
      } catch (error) {
        console.error("Failed to complete onboarding:", error);
        // Optionally show error toast to user
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Step {step} of {steps.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {steps.map((s) => (
            <div
              key={s.number}
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                s.number === step
                  ? "bg-green-600 text-white"
                  : s.number < step
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {s.number}
            </div>
          ))}
        </div>
        <div className="text-sm font-medium text-green-800">
          {steps.find((s) => s.number === step)?.title}
        </div>
      </div>

      {/* Current Step Content */}
      {CurrentStepComponent && (
        <CurrentStepComponent
          data={onboardingData}
          onNext={handleNext}
          onBack={handleBack}
          userRole={user?.role}
          isLastStep={step === 4}
        />
      )}
    </div>
  );
};
