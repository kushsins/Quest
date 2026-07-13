import { useCallback, useMemo } from "react";

import { useAuth } from "@/features/auth/hooks/useAuth";
import type { PermissionKey } from "@/features/auth/types/auth.types";

export function usePermissions() {
  const { user, hasPermission } = useAuth();

  const permissions = useMemo(
    () => user?.permissions ?? [],
    [user?.permissions],
  );

  const hasAllPermissions = useCallback(
    (required: PermissionKey[]) => {
      return required.every((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  const hasAnyPermission = useCallback(
    (required: PermissionKey[]) => {
      return required.some((permission) => hasPermission(permission));
    },
    [hasPermission],
  );

  return {
    permissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };
}
