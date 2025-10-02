/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/onboarding/steps/ReviewStep.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ReviewStepProps {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  userRole?: string;
  isLastStep: boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onNext,
  onBack,
}) => {
  const { user } = useAuth();
  const isCorpsMember = user?.role === "CORPS_MEMBER";

  const handleComplete = () => {
    // Pass ALL the accumulated data for completion
    onNext({
      personalInfo: data.personalInfo,
      documents: data.documents,
      skills: data.skills || [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Review Your Information</h3>
        <p className="text-sm text-muted-foreground">
          Please review all your information before completing the onboarding
          process
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Personal Information</h4>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Phone:</span>
              <p className="font-medium">
                {data.personalInfo?.phoneNumber || "Not provided"}
              </p>
            </div>
            {isCorpsMember ? (
              <>
                <div>
                  <span className="text-muted-foreground">
                    State of Service:
                  </span>
                  <p className="font-medium">
                    {data.personalInfo?.stateOfService || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">State Code:</span>
                  <p className="font-medium">
                    {data.personalInfo?.stateCode || "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Call-up Number:</span>
                  <p className="font-medium">
                    {data.personalInfo?.callUpNumber || "Not provided"}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <span className="text-muted-foreground">Tertiary School:</span>
                <p className="font-medium">
                  {data.personalInfo?.tertiarySchool || "Not provided"}
                </p>
              </div>
            )}
            {data.personalInfo?.dateOfBirth && (
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <p className="font-medium">{data.personalInfo.dateOfBirth}</p>
              </div>
            )}
            {data.personalInfo?.gender && (
              <div>
                <span className="text-muted-foreground">Gender:</span>
                <p className="font-medium capitalize">
                  {data.personalInfo.gender}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Documents</h4>
          </div>
          <div className="space-y-2 text-sm">
            {data.documents?.map((doc: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span>{doc.fileName}</span>
                <span className="text-green-600 text-xs">Uploaded ✓</span>
              </div>
            )) || (
              <p className="text-muted-foreground">No documents uploaded</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills?.map((skill: any, index: number) => (
              <div
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {skill.name} (Level {skill.level})
              </div>
            )) || <p className="text-muted-foreground">No skills added</p>}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleComplete}
          className="bg-green-600 hover:bg-green-700"
        >
          Complete Onboarding
        </Button>
      </div>
    </div>
  );
};
