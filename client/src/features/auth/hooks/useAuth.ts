import { useAuthContext } from "@/features/auth/context/AuthProvider";

export function useAuth() {
  return useAuthContext();
}
