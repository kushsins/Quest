import "dotenv/config";

import { PrismaClient } from "@prisma/client";

import {
  ALL_PERMISSIONS,
  MANAGER_PERMISSIONS,
  MEMBER_PERMISSIONS,
} from "../src/shared/constants/permissions.js";
import { hashPassword } from "../src/shared/utils/password.util.js";

const prisma = new PrismaClient();

const PERMISSION_DEFINITIONS: Record<
  (typeof ALL_PERMISSIONS)[number],
  { name: string; description: string }
> = {
  VIEW_DASHBOARD: {
    name: "View Dashboard",
    description: "View dashboard statistics.",
  },
  VIEW_USERS: {
    name: "View Users",
    description: "View application users.",
  },
  VIEW_TICKETS: {
    name: "View Tickets",
    description: "View support tickets.",
  },
  CREATE_TICKET: {
    name: "Create Ticket",
    description: "Create new support tickets.",
  },
  UPDATE_TICKET: {
    name: "Update Ticket",
    description: "Update ticket details.",
  },
  DELETE_TICKET: {
    name: "Delete Ticket",
    description: "Delete support tickets.",
  },
  ASSIGN_TICKET: {
    name: "Assign Ticket",
    description: "Assign tickets to users.",
  },
  ADD_COMMENT: {
    name: "Add Comment",
    description: "Add comments to tickets.",
  },
};

async function getNextLookupId(
  model: "role" | "permission",
): Promise<number> {
  if (model === "role") {
    const result = await prisma.role.aggregate({ _max: { id: true } });
    return (result._max.id ?? 0) + 1;
  }

  const result = await prisma.permission.aggregate({ _max: { id: true } });
  return (result._max.id ?? 0) + 1;
}

async function upsertRole(name: string, description: string) {
  return prisma.role.upsert({
    where: { name },
    update: { description },
    create: {
      id: await getNextLookupId("role"),
      name,
      description,
    },
  });
}

async function upsertPermission(
  key: (typeof ALL_PERMISSIONS)[number],
  name: string,
  description: string,
) {
  return prisma.permission.upsert({
    where: { key },
    update: { name, description },
    create: {
      id: await getNextLookupId("permission"),
      key,
      name,
      description,
    },
  });
}

async function syncRolePermissions(
  roleId: number,
  permissionKeys: (typeof ALL_PERMISSIONS)[number][],
) {
  const permissions = await prisma.permission.findMany({
    where: {
      key: {
        in: permissionKeys,
      },
    },
  });

  await prisma.rolePermission.deleteMany({
    where: { roleId },
  });

  await prisma.rolePermission.createMany({
    data: permissions.map((permission) => ({
      roleId,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });
}

async function upsertUser(
  name: string,
  email: string,
  password: string,
  roleName: string,
) {
  const role = await prisma.role.findUniqueOrThrow({
    where: { name: roleName },
  });

  const passwordHash = await hashPassword(password);

  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      roleId: role.id,
    },
    create: {
      name,
      email,
      passwordHash,
      roleId: role.id,
    },
  });
}

async function main(): Promise<void> {
  const memberRole = await upsertRole(
    "Member",
    "Standard team member responsible for handling tickets.",
  );
  const managerRole = await upsertRole(
    "Manager",
    "Team member with elevated permissions.",
  );

  for (const permissionKey of ALL_PERMISSIONS) {
    const definition = PERMISSION_DEFINITIONS[permissionKey];
    await upsertPermission(
      permissionKey,
      definition.name,
      definition.description,
    );
  }

  await syncRolePermissions(memberRole.id, MEMBER_PERMISSIONS);
  await syncRolePermissions(managerRole.id, MANAGER_PERMISSIONS);

  await upsertUser(
    "Quest Manager",
    "manager@quest.com",
    "password123",
    "Manager",
  );
  await upsertUser(
    "Quest Member",
    "member@quest.com",
    "password123",
    "Member",
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
