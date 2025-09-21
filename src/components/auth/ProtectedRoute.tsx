import { useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: User["role"];
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      sessionStorage.setItem("intended-path", window.location.pathname);
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && requiredRole && user) {
      const hasPermission = user.role === requiredRole || user.role === "admin";

      if (!hasPermission) {
        navigate("/unauthorized", { replace: true });
      }
    }
  }, [user, requiredRole, isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (
    requiredRole &&
    user &&
    user.role !== requiredRole &&
    user.role !== "admin"
  ) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
