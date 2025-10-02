// src/components/onboarding/OnboardingDialog.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOnboarding } from "@/context/OnboardingContext";
import { OnboardingSteps } from "./OnboardingSteps";

export const OnboardingDialog: React.FC = () => {
  const { showOnboarding, closeOnboarding, currentStep } = useOnboarding();

  return (
    <Dialog open={showOnboarding} onOpenChange={closeOnboarding}>
      <DialogContent className="md:min-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-green-800">
            Complete Your Profile
          </DialogTitle>
        </DialogHeader>
        <OnboardingSteps
          currentStep={currentStep}
          onComplete={closeOnboarding}
        />
      </DialogContent>
    </Dialog>
  );
};
