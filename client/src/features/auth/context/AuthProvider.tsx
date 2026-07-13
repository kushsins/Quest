import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  refreshRequest,
} from "@/features/auth/api/auth.api";
import type {
  AuthStatus,
  AuthUser,
  LoginCredentials,
  PermissionKey,
} from "@/features/auth/types/auth.types";
import {
  clearAccessToken,
  setAccessToken,
} from "@/shared/auth/accessToken";
import { registerSessionExpiredHandler } from "@/shared/auth/authSession";

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: PermissionKey) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

let bootstrapPromise: Promise<AuthBootstrapResult> | null = null;

interface AuthBootstrapResult {
  user: AuthUser | null;
}

async function runBootstrap(): Promise<AuthBootstrapResult> {
  try {
    const accessToken = await refreshRequest();
    setAccessToken(accessToken);
    const user = await getCurrentUserRequest();
    return { user };
  } catch {
    clearAccessToken();
    return { user: null };
  }
}

function getBootstrapPromise(): Promise<AuthBootstrapResult> {
  if (!bootstrapPromise) {
    bootstrapPromise = runBootstrap();
  }

  return bootstrapPromise;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [user, setUser] = useState<AuthUser | null>(null);

  const clearAuthState = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setStatus("unauthenticated");
    queryClient.clear();
  }, [queryClient]);

  const handleSessionExpired = useCallback(() => {
    clearAuthState();
    void navigate("/login", { replace: true });
    toast.error("Your session has expired. Please sign in again.");
  }, [clearAuthState, navigate]);

  useEffect(() => {
    return registerSessionExpiredHandler(handleSessionExpired);
  }, [handleSessionExpired]);

  useEffect(() => {
    let isActive = true;

    async function initialize() {
      setStatus("initializing");

      const result = await getBootstrapPromise();

      if (!isActive) {
        return;
      }

      if (result.user) {
        setUser(result.user);
        setStatus("authenticated");
        return;
      }

      setUser(null);
      setStatus("unauthenticated");
    }

    void initialize();

    return () => {
      isActive = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const result = await loginRequest(credentials);
    setAccessToken(result.accessToken);
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Local cleanup still runs when the session is already invalid.
    } finally {
      clearAuthState();
      void navigate("/login", { replace: true });
    }
  }, [clearAuthState, navigate]);

  const hasPermission = useCallback(
    (permission: PermissionKey) => {
      return user?.permissions.includes(permission) ?? false;
    },
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === "authenticated",
      isInitializing: status === "idle" || status === "initializing",
      login,
      logout,
      hasPermission,
    }),
    [status, user, login, logout, hasPermission],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
