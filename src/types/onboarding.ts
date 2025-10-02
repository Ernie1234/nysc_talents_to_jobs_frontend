// src/types/onboarding.ts
export interface PersonalInfo {
  phoneNumber: string;
  stateOfService: string;
  placeOfPrimaryAssignment: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other" | "prefer-not-to-say";
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface Document {
  fileName: string;
  fileUrl: string;
  fileType: "posting_letter" | "placement_letter" | "resume" | "other";
  fileSize: number;
  uploadedAt: Date;
}

export interface OnboardingData {
  personalInfo: PersonalInfo;
  documents: Document[];
  skills: string[];
}

export interface OnboardingProgress {
  onboardingCompleted: boolean;
  onboardingStep: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile: any;
}
