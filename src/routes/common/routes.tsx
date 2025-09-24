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
    ],
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
