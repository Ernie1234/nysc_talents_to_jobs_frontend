// hooks/useAuth.ts
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { checkTokenExpiry } from "@/features/auth/authSlice";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useTypedSelector((state) => state.auth);

  // Check token expiry on component mount
  useEffect(() => {
    dispatch(checkTokenExpiry());
  }, [dispatch]);

  // Also check periodically (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(checkTokenExpiry());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return {
    ...auth,
    // Add computed properties
    isTokenExpired:
      !auth.accessToken || !auth.expiresAt || auth.expiresAt <= Date.now(),
    // Ensure isAuthenticated is reliable
    isAuthenticated:
      auth.isAuthenticated &&
      auth.accessToken &&
      auth.expiresAt &&
      auth.expiresAt > Date.now(),
  };
};
