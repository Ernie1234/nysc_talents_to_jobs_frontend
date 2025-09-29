/* eslint-disable @typescript-eslint/no-explicit-any */
// types/application-types.ts
export interface IApplicantUser {
  profile: {
    skills: string[];
  };
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  id: string;
}

export interface IApplicantJob {
  _id: string;
  title: string;
  jobType: string;
  experienceLevel: string;
  isActive: boolean;
  requirements: string;
  id: string;
}

// features/applications/application-types.ts
export interface IResumeDocument {
  _id: string;
  userId: string;
  documentId: string;
  title: string;
  summary: string;
  themeColor: string;
  currentPosition: number;
  status: string;
  authorName: string;
  authorEmail: string;
  experiences: string[];
  educations: string[];
  skills: string[];
  personalInfo?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface IApplication {
  _id: string;
  jobId: string;
  employerId: string;
  userId: string;
  documentId?: string;
  resumeUploadId?: string;
  status: ApplicationStatus;
  aboutJob?: string;
  coverLetter?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  user?: IApplicantUser;
  job?: IApplicantJob;
  resumeDocument?: IResumeDocument;

  uploadedResume?: any;
  id: string;
}

export interface ApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applicants: IApplication[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: IApplication;
}

export interface ApplicationQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  jobId?: string;
}

export interface UpdateApplicationInput {
  status?: ApplicationStatus;
  reviewedAt?: string;
  coverLetter?: string;
}

export interface EmployerApplicationAnalysis {
  totalApplications: number;
  applicationStats: {
    pending: number;
    under_review: number;
    shortlisted: number;
    interview: number;
    rejected: number;
    accepted: number;
    withdrawn: number;
  };
  applicationTrends: {
    daily: Array<{
      date: string;
      count: number;
    }>;
    weekly: Array<{
      week: string;
      count: number;
    }>;
    monthly: Array<{
      month: string;
      count: number;
    }>;
  };
  recentApplications: Array<{
    applicationId: string;
    jobId: string;
    jobTitle: string;
    applicantName: string;
    applicantEmail: string;
    status: string;
    appliedAt: Date;
    reviewedAt?: Date;
    coverLetter?: string;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  averageApplicationTime: {
    appliedToReviewed: number; // in hours
    appliedToAccepted: number; // in hours
  };
}

export interface ApplicationAnalysisResponse {
  success: boolean;
  message: string;
  data: EmployerApplicationAnalysis;
}

export type ApplicationStatus =
  | "pending"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "accepted"
  | "withdrawn";

export interface UserApplication {
  id: string;
  jobId: string;
  employerId: string;
  userId: string;
  documentId?: string;
  resumeUploadId?: string;
  status:
    | "pending"
    | "under_review"
    | "shortlisted"
    | "rejected"
    | "hired"
    | "withdrawn";
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  job: {
    title: string;
    jobType: string;
    workLocation: string;
    companyName?: string;
    hiringLocation: {
      type: string;
      state?: string;
    };
    salaryRange?: {
      min: number;
      max: number;
      currency: string;
      isPublic: boolean;
    };
  };
  employer: {
    firstName: string;
    lastName: string;
    fullName: string;
    companyName?: string;
  };
  resumeDocument?: any;
  uploadedResume?: any;
}

export interface UserApplicationsResponse {
  success: boolean;
  message: string;
  data: {
    applications: UserApplication[];
    total: number;
    page: number;
    totalPages: number;
  };
}
