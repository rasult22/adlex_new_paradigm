import { useEffect, type PropsWithChildren } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";
import { getCurrentUser, refreshTokens } from "@/queries/auth";

const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { accessToken, refreshToken, setAuth, clearAuth, setLoading, isAuthenticated } = useAuthStore();

  // Query for refreshing tokens every 5 minutes
  useQuery({
    queryKey: ["auth-refresh"],
    queryFn: async () => {
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      
      console.log("Refreshing tokens...");
      const newTokens = await refreshTokens(refreshToken);
      const user = await getCurrentUser(newTokens.access_token);
      setAuth(user, newTokens);
      console.log("Tokens refreshed successfully");
      return newTokens;
    },
    enabled: isAuthenticated && !!refreshToken,
    refetchInterval: REFRESH_INTERVAL,
    refetchIntervalInBackground: true, // Keep refreshing even when tab is not active
    retry: 1,
    staleTime: REFRESH_INTERVAL - 30000, // Consider stale 30 seconds before next refresh
    meta: {
      onError: () => {
        console.log("Token refresh failed, clearing auth...");
        clearAuth();
      }
    }
  });

  // Initial auth check on app load
  useEffect(() => {
    const initAuth = async () => {
      // If no tokens, just set loading to false
      if (!accessToken && !refreshToken) {
        setLoading(false);
        return;
      }

      try {
        // Try to get current user with access token
        if (accessToken) {
          const user = await getCurrentUser(accessToken);
          setAuth(user, {
            access_token: accessToken,
            refresh_token: refreshToken || "",
            token_type: "bearer",
            expires_in: 0,
          });
          return;
        }
      } catch {
        // Access token invalid, try to refresh
        console.log("Access token expired, attempting refresh...");
      }

      // Try to refresh tokens
      if (refreshToken) {
        try {
          const newTokens = await refreshTokens(refreshToken);
          const user = await getCurrentUser(newTokens.access_token);
          setAuth(user, newTokens);
          return;
        } catch {
          // Refresh failed, clear auth
          console.log("Token refresh failed, clearing auth...");
          clearAuth();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  return <>{children}</>;
};

export { useAuthStore } from "@/stores/auth";
