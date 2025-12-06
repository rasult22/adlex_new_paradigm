import { useEffect, type PropsWithChildren } from "react";
import { useAuthStore } from "@/stores/auth";
import { getCurrentUser, refreshTokens } from "@/queries/auth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { accessToken, refreshToken, setAuth, clearAuth, setLoading } = useAuthStore();

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
