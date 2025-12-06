import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/auth";
import type { PropsWithChildren } from "react";

interface ProtectedRouteProps extends PropsWithChildren {
  redirectTo?: string;
}

export const ProtectedRoute = ({ 
  children, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-solid border-t-transparent" />
          <p className="text-sm text-tertiary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
