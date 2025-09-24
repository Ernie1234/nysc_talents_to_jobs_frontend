// hooks/useAuthExpiration.ts
import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout, updateTokens } from "@/features/auth/authSlice"; // Import updateTokens
import { useRefreshMutation } from "@/features/auth/authAPI";

const useAuthExpiration = () => {
  const { accessToken, expiresAt } = useTypedSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshMutation();

  useEffect(() => {
    const handleLogout = () => {
      console.log("Token expired, logging out...");
      dispatch(logout());
    };

    const handleTokenRefresh = async () => {
      try {
        const result = await refreshToken({}).unwrap();
        // Use the new updateTokens action
        dispatch(
          updateTokens({
            accessToken: result.accessToken,
            expiresAt: result.expiresAt,
          })
        );
        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Token refresh failed, logging out...", error);
        handleLogout();
      }
    };

    if (accessToken && expiresAt) {
      const currentTime = Date.now();
      const timeUntilExpiration = expiresAt - currentTime;

      // Refresh token 5 minutes before expiration
      const refreshThreshold = 5 * 60 * 1000; // 5 minutes

      if (timeUntilExpiration <= 0) {
        // Token is already expired
        handleTokenRefresh();
      } else if (timeUntilExpiration <= refreshThreshold) {
        // Token is about to expire, refresh it
        handleTokenRefresh();
      } else {
        // Set timeout to refresh token before expiration
        const refreshTime = timeUntilExpiration - refreshThreshold;
        const refreshTimer = setTimeout(handleTokenRefresh, refreshTime);

        // Also set a fallback logout timer
        const logoutTimer = setTimeout(handleLogout, timeUntilExpiration);

        return () => {
          clearTimeout(refreshTimer);
          clearTimeout(logoutTimer);
        };
      }
    }
  }, [accessToken, dispatch, expiresAt, refreshToken]);
};

export default useAuthExpiration;
