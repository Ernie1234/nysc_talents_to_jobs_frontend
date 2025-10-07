/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CreateCourseRequest {
  title: string;
  description: string;
  duration: number;
  prerequisites?: string[];
  learningObjectives?: string[];
  coverImage?: string;
}

export interface StaffProfile {
  companyName?: string;
  companySize: string;
  industry: string;
  companyDescription: string;
  website: string;
  location: string;
}

export interface StaffInfo {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  staffProfile?: StaffProfile;
}

export interface Course {
  id: string;
  _id: string; // Add this to handle both formats
  title: string;
  description: string;
  duration: number;
  prerequisites: string[];
  learningObjectives: string[];
  coverImage?: string;
  status: "draft" | "published" | "archived";
  enrolledStudents: any[];
  staffId: StaffInfo;
  enrolledCount: number;
  availableSpots?: number | null;
  totalSessions: number;
  attendanceRate: number;
  isActive: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  qrSessions: any[];
}

export interface CoursesResponse {
  success: boolean;
  message: string;
  data: {
    courses: Course[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export interface QrSessionResponse {
  success: boolean;
  message: string;
  data: {
    qrSession: {
      id: string;
      sessionCode: string;
      expiresAt: string;
      isActive: boolean;
    };
    qrData: string;
    expiresAt: string;
  };
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: {
    attendanceRecords: any[];
    studentStats: Array<{
      studentId: string;
      firstName: string;
      lastName: string;
      totalSessions: number;
      attendedSessions: number;
      attendanceRate: number;
      status: "PASS" | "FAIL";
    }>;
  };
}

export interface ClearanceEligibilityResponse {
  success: boolean;
  message: string;
  data: {
    eligible: boolean;
    attendanceRate: number;
    requiredRate: number;
    message: string;
  };
}
