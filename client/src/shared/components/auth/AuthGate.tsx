import { Outlet } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { AuthSplash } from "@/shared/components/auth/AuthSplash";

export function AuthGate() {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return <AuthSplash />;
  }

  return <Outlet />;
}
