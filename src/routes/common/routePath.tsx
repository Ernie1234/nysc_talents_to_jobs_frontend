export const isAuthRoute = (pathname: string): boolean => {
  const authPaths = Object.values(AUTH_ROUTES);
  return authPaths.some((path) => pathname.startsWith(path));
};

export const isProtectedRoute = (pathname: string): boolean => {
  const protectedPaths = Object.values(PROTECTED_ROUTES);
  return (
    protectedPaths.some((path) => pathname.startsWith(path)) || pathname === "/"
  );
};

export const PUBLIC_ROUTES = {
  HOME: "/",
};

export const AUTH_ROUTES = {
  SIGN_IN: "/auth/login",
  SIGN_UP: "/auth/register",
};

export const PROTECTED_ROUTES = {
  DASHBOARD: "/dashboard",
  FIND_WORK: "/find-work",
  JOB_DETAILS: "/find-work/:jobId",
  CREATE_JOB: "/create-job",
  RESUME: "/dashboard/resume",
  APPLICATIONS: "/dashboard/applications",
  EDIT_RESUME: "/dashboard/resume/:documentId/edit",
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_APPEARANCE: "/settings/appearance",
  SETTINGS_BILLING: "/settings/billing",
};
