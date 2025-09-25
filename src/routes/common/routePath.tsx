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
  RESUME: "/dashboard/resume",
  EDIT_RESUME: "/dashboard/resume/:documentId/edit",
  SETTINGS: "/settings",
  SETTINGS_ACCOUNT: "/settings/account",
  SETTINGS_APPEARANCE: "/settings/appearance",
  SETTINGS_BILLING: "/settings/billing",
};
