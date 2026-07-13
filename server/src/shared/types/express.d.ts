import type { PermissionKey } from "../constants/permissions.js";

export interface AuthenticatedUser {
  id: string;
  sessionId: string;
  name: string;
  email: string;
  role: {
    id: number;
    name: string;
  };
  permissions: PermissionKey[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
