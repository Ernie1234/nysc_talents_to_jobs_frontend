/**
 * Interface for the Employer object nested within the Job structure.
 */
export interface IEmployerId {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "employer";
  fullName: string;
  id: string;
}

/**
 * Interface for the Salary Range object.
 */
export interface ISalaryRange {
  min: number;
  max: number;
  currency: string;
  isPublic: boolean;
}

/**
 * Interface for the Hiring Location object.
 */
export interface IHiringLocation {
  type: "nation-wide" | "state";
  state?: string; // Optional because it's sometimes empty or not present for 'nation-wide'
}

/**
 * Interface for the User (Applicant) ID object nested within the applicants array.
 */
export interface IApplicantUserId {
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

/**
 * Interface for an individual Applicant record on a job posting.
 */
export interface IApplicant {
  jobId: string;
  employerId: string;
  userId: IApplicantUserId;
  documentId: string;
  status: "under_review" | "shortlisted" | "rejected" | "hired"; // Example statuses
  appliedAt: string; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  reviewedAt?: string; // Optional ISO Date string
  id: string;
}
/**
 * Interface for a single Job posting.
 * FIX: Added 'archived' to status and 'companyLogo' (optional).
 */
export interface IJob {
  employerId: IEmployerId;
  title: string;
  jobType: "part-time" | "full-time" | "contract" | "intern"; // Add other types as needed
  experienceLevel: "entry-level" | "mid-level" | "senior" | "intern";
  workLocation: "remote" | "on-site" | "hybrid";
  jobPeriod: string; // e.g., "1-3 months", "more than 12 months"
  skills: string[];
  aboutJob: string;
  requirements: string;
  salaryRange: ISalaryRange;
  hiringLocation: IHiringLocation;
  // FIX: Added 'archived' status to align with UI logic
  status: "published" | "draft" | "closed" | "archived";
  applicationCount: number;
  viewCount: number;
  applicants: IApplicant[];
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  publishedAt: string; // ISO Date string
  closedAt?: string; // Optional ISO Date string (only present if status is 'closed')
  isActive: boolean;
  // FIX: Added optional companyLogo property as it is used in JobItem.tsx
  companyLogo?: string;
  id: string;
}

export interface CreateJobRequest {
  title: string;
  jobType: IJob["jobType"];
  experienceLevel: IJob["experienceLevel"];
  workLocation: IJob["workLocation"];
  jobPeriod: IJob["jobPeriod"];
  skills: string[];
  aboutJob: string;
  requirements: string;
  salaryRange: {
    min: number;
    max: number;
    currency?: string;
    isPublic?: boolean;
  };
  hiringLocation: {
    type: "nation-wide" | "state";
    state?: string;
  };
  // FIX: Added 'archived' status type
  status?: "draft" | "published" | "closed" | "archived";
}

export interface CreateJobResponse {
  success: boolean;
  message: string;
  data: IJob;
}

export interface JobsResponse {
  success: boolean;
  message: string;
  data: {
    jobs: IJob[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface JobQueryParams {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
  jobType?: string;
  experienceLevel?: string;
  workLocation?: string;
}
