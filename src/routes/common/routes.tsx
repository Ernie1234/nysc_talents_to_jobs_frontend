import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "./routePath";

import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/RegisterPage";

import { DashboardLayout } from "@/layout/DashboardLayout";
import Dashboard from "@/pages/dashboard/Dashboard";

import SettingLayout from "@/layout/SettingLayout";
import Account from "@/pages/settings/Account";
import Billing from "@/pages/settings/Billing";
import Appearance from "@/pages/settings/Appearance";
import HomePage from "@/pages/home/HomePage";
import { ResumePage } from "@/pages/dashboard/ResumePage";
import DocumentEditPage from "@/pages/dashboard/DocumentEditPage";
import FindWorkPage from "@/pages/dashboard/FindWorkPage";
import ApplicationPage from "@/pages/dashboard/ApplicationPage";
import JobDetailsPage from "@/components/findWork/JobDetailsPage";
import StaffJobCreatePage from "@/pages/dashboard/StaffJobCreatePage";
import CreateCoursePage from "@/components/dashboard/courses/CreateCoursePage";
import CourseHomePage from "@/pages/course/CourseHomePage";
import CourseDetailsPage from "@/pages/course/CourseDetailsPage";
import CourseAttendancePage from "@/pages/course/CourseAttendancePage";
import GenerateQrPage from "@/pages/course/GenerateQrPage";
import { UsersTable } from "@/components/admin/UsersTable";
import { DocumentReview } from "@/components/admin/DocumentReview";

export const publicRoutePaths = [
  {
    path: PUBLIC_ROUTES.HOME,
    element: <HomePage />,
  },
];

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.SIGN_IN, element: <LoginPage /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <RegisterPage /> },
];

export const protectedRoutePaths = [
  {
    path: PROTECTED_ROUTES.DASHBOARD,
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: PROTECTED_ROUTES.RESUME,
        element: <ResumePage />,
      },
      {
        path: PROTECTED_ROUTES.EDIT_RESUME,
        element: <DocumentEditPage />,
      },
      {
        path: PROTECTED_ROUTES.APPLICATIONS,
        element: <ApplicationPage />,
      },
    ],
  },
  {
    path: PROTECTED_ROUTES.COURSES,
    children: [
      {
        index: true,
        path: PROTECTED_ROUTES.COURSES,
        element: <CourseHomePage />,
      },
      {
        path: PROTECTED_ROUTES.CREATE_COURSES,
        element: <CreateCoursePage />,
      },
      {
        path: PROTECTED_ROUTES.COURSES_DETAILS,
        element: <CourseDetailsPage />,
      },
      {
        path: PROTECTED_ROUTES.COURSES_ATTENDANCE,
        element: <CourseAttendancePage />,
      },
      {
        path: PROTECTED_ROUTES.COURSES_GENERATE_QR,
        element: <GenerateQrPage />,
      },
    ],
  },

  {
    path: PROTECTED_ROUTES.APPROVE_INTERNS,
    element: <UsersTable />,
  },
  {
    path: PROTECTED_ROUTES.DOCUMENT_REVIEW,
    element: <DocumentReview />,
  },
  {
    path: PROTECTED_ROUTES.FIND_WORK,
    element: <FindWorkPage />,
  },
  {
    path: PROTECTED_ROUTES.JOB_DETAILS,
    element: <JobDetailsPage />,
  },

  {
    path: PROTECTED_ROUTES.CREATE_JOB,
    element: <StaffJobCreatePage />,
  },
  {
    path: PROTECTED_ROUTES.SETTINGS,
    element: <SettingLayout />,
    children: [
      {
        index: true,
        element: <Account />,
      },
      {
        path: PROTECTED_ROUTES.SETTINGS_ACCOUNT,
        element: <Account />,
      },
      {
        path: PROTECTED_ROUTES.SETTINGS_APPEARANCE,
        element: <Appearance />,
      },
      {
        path: "billing",
        element: <Billing />,
      },
    ],
  },
];
