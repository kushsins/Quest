export const Permission = {
  VIEW_DASHBOARD: "VIEW_DASHBOARD",
  VIEW_USERS: "VIEW_USERS",
  VIEW_TICKETS: "VIEW_TICKETS",
  CREATE_TICKET: "CREATE_TICKET",
  UPDATE_TICKET: "UPDATE_TICKET",
  DELETE_TICKET: "DELETE_TICKET",
  ASSIGN_TICKET: "ASSIGN_TICKET",
  ADD_COMMENT: "ADD_COMMENT",
} as const;

export type PermissionKey = (typeof Permission)[keyof typeof Permission];

export const ALL_PERMISSIONS: PermissionKey[] = Object.values(Permission);

export const MEMBER_PERMISSIONS: PermissionKey[] = ALL_PERMISSIONS.filter(
  (permission) => permission !== Permission.DELETE_TICKET,
);

export const MANAGER_PERMISSIONS: PermissionKey[] = [...ALL_PERMISSIONS];
