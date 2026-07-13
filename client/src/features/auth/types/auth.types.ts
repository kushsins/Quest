export type PermissionKey =
  | "VIEW_DASHBOARD"
  | "VIEW_USERS"
  | "VIEW_TICKETS"
  | "CREATE_TICKET"
  | "UPDATE_TICKET"
  | "DELETE_TICKET"
  | "ASSIGN_TICKET"
  | "ADD_COMMENT";

export interface AuthRole {
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
}

export type AuthStatus =
  | "idle"
  | "initializing"
  | "authenticated"
  | "unauthenticated";
