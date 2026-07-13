import type { PermissionKey } from "../../shared/constants/permissions.js";

interface AuthRole {
  id: number;
  name: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  permissions: PermissionKey[];
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}
