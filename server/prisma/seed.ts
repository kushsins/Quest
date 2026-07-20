import "dotenv/config";

import {
  ActivityAction,
  PrismaClient,
  TicketPriority,
  TicketStatus,
} from "@prisma/client";

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

interface SeedTicket {
  ticketNumber: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  reporterEmail: string;
  assigneeEmail: string;
  comments: Array<{ authorEmail: string; message: string }>;
}

const SEED_TICKETS: SeedTicket[] = [
  {
    ticketNumber: "QST-001",
    title: "Unable to login after password reset",
    description:
      "User reports invalid credentials after completing the password reset flow.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [
      {
        authorEmail: "manager@quest.com",
        message: "I can reproduce this in staging. Investigating the auth callback.",
      },
    ],
  },
  {
    ticketNumber: "QST-002",
    title: "Dashboard statistics not loading",
    description: "Dashboard cards remain in a loading state after login.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Checking the dashboard API response in network tab.",
      },
      {
        authorEmail: "manager@quest.com",
        message: "Looks like a permissions issue on the statistics endpoint.",
      },
    ],
  },
  {
    ticketNumber: "QST-003",
    title: "Ticket list sort order incorrect",
    description: "Sorting by priority does not place urgent tickets first.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.URGENT,
    reporterEmail: "member@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-004",
    title: "Assignee dropdown missing users",
    description: "Only one user appears in the assignee selector.",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.HIGH,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [
      {
        authorEmail: "manager@quest.com",
        message: "Fixed after users endpoint was wired up.",
      },
    ],
  },
  {
    ticketNumber: "QST-005",
    title: "Comment timestamps show wrong timezone",
    description: "Comments display UTC instead of local time in the panel.",
    status: TicketStatus.CLOSED,
    priority: TicketPriority.LOW,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Verified fix in QA. Closing ticket.",
      },
    ],
  },
  {
    ticketNumber: "QST-006",
    title: "Mobile ticket panel overlaps sidebar",
    description: "On tablet widths the slide-over panel covers navigation.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Working on responsive breakpoints for the panel.",
      },
    ],
  },
  {
    ticketNumber: "QST-007",
    title: "Search ignores ticket number",
    description: "Searching for QST-001 returns no results.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-008",
    title: "Cannot cancel resolved ticket",
    description: "Attempting to cancel from resolved state returns validation error.",
    status: TicketStatus.CANCELLED,
    priority: TicketPriority.LOW,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "manager@quest.com",
        message: "Cancelled per customer request. No further action needed.",
      },
    ],
  },
  {
    ticketNumber: "QST-009",
    title: "Session expires too quickly",
    description: "Users are logged out after a few minutes of inactivity.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.HIGH,
    reporterEmail: "member@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Reviewing access token expiry configuration.",
      },
    ],
  },
  {
    ticketNumber: "QST-010",
    title: "Filter by status returns duplicate rows",
    description: "Open filter intermittently shows the same ticket twice.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.URGENT,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-011",
    title: "Create ticket modal validation unclear",
    description: "Required field errors do not highlight the title input.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-012",
    title: "Activity timeline missing assignment event",
    description: "Reassigning a ticket does not appear in the activity feed.",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Assignment activities now logging correctly.",
      },
    ],
  },
  {
    ticketNumber: "QST-013",
    title: "Dark theme contrast on status badges",
    description: "Open status badge is hard to read in dark mode.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-014",
    title: "Export tickets to CSV",
    description: "Feature request: export current filtered ticket list.",
    status: TicketStatus.CANCELLED,
    priority: TicketPriority.LOW,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [
      {
        authorEmail: "manager@quest.com",
        message: "Out of scope for V1. Cancelling.",
      },
    ],
  },
  {
    ticketNumber: "QST-015",
    title: "Pagination resets after ticket update",
    description: "Returning to the list jumps back to page one.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    reporterEmail: "member@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Will preserve query params in list state.",
      },
    ],
  },
  {
    ticketNumber: "QST-016",
    title: "Reporter field not visible in list view",
    description: "Ticket table should show who reported each ticket.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-017",
    title: "Invalid status transition message unclear",
    description: "Users see a generic error when moving from closed to open.",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.HIGH,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [
      {
        authorEmail: "manager@quest.com",
        message: "Improved workflow error copy deployed.",
      },
    ],
  },
  {
    ticketNumber: "QST-018",
    title: "My Tickets filter shows unassigned items",
    description: "Quick filter includes tickets not assigned to current user.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.URGENT,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-019",
    title: "Long descriptions break panel layout",
    description: "Very long ticket descriptions overflow the details panel.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.LOW,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-020",
    title: "Refresh token cookie not sent on logout",
    description: "Logout sometimes fails when credentials are omitted.",
    status: TicketStatus.CLOSED,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Confirmed fix with credentials included on refresh.",
      },
    ],
  },
  {
    ticketNumber: "QST-021",
    title: "Member cannot delete own tickets",
    description: "Expected behavior verification for role permissions.",
    status: TicketStatus.CLOSED,
    priority: TicketPriority.LOW,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [
      {
        authorEmail: "manager@quest.com",
        message: "Working as designed. Only managers can delete.",
      },
    ],
  },
  {
    ticketNumber: "QST-022",
    title: "Empty state illustration missing on tickets page",
    description: "No tickets view should show the documented empty state.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [],
  },
  {
    ticketNumber: "QST-023",
    title: "Inline edit saves on blur unexpectedly",
    description: "Title field submits before user finishes typing.",
    status: TicketStatus.RESOLVED,
    priority: TicketPriority.MEDIUM,
    reporterEmail: "member@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Added explicit save control for title edits.",
      },
    ],
  },
  {
    ticketNumber: "QST-024",
    title: "API returns 403 for comment on valid ticket",
    description: "Member role receives forbidden when adding comments.",
    status: TicketStatus.IN_PROGRESS,
    priority: TicketPriority.HIGH,
    reporterEmail: "manager@quest.com",
    assigneeEmail: "member@quest.com",
    comments: [
      {
        authorEmail: "member@quest.com",
        message: "Checking ADD_COMMENT permission in seed data.",
      },
    ],
  },
  {
    ticketNumber: "QST-025",
    title: "Health check should include API version",
    description: "Suggestion to expose version in health endpoint response.",
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    reporterEmail: "member@quest.com",
    assigneeEmail: "manager@quest.com",
    comments: [],
  },
];

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

async function seedTickets(): Promise<void> {
  await prisma.comment.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.ticket.deleteMany();

  const users = await prisma.user.findMany({
    select: { id: true, email: true },
  });
  const usersByEmail = new Map(users.map((user) => [user.email, user.id]));

  for (const seedTicket of SEED_TICKETS) {
    const reporterId = usersByEmail.get(seedTicket.reporterEmail);
    const assigneeId = usersByEmail.get(seedTicket.assigneeEmail);

    if (!reporterId || !assigneeId) {
      throw new Error(
        `Missing seed user for ticket ${seedTicket.ticketNumber}.`,
      );
    }

    const ticket = await prisma.ticket.create({
      data: {
        ticketNumber: seedTicket.ticketNumber,
        title: seedTicket.title,
        description: seedTicket.description,
        status: seedTicket.status,
        priority: seedTicket.priority,
        reporterId,
        assigneeId,
      },
    });

    await prisma.activity.create({
      data: {
        ticketId: ticket.id,
        action: ActivityAction.CREATED,
        performedBy: reporterId,
      },
    });

    if (reporterId !== assigneeId) {
      await prisma.activity.create({
        data: {
          ticketId: ticket.id,
          action: ActivityAction.UPDATED,
          performedBy: reporterId,
          fieldName: "assignee",
          previousValue: reporterId,
          newValue: assigneeId,
        },
      });
    }

    if (seedTicket.status !== TicketStatus.OPEN) {
      await prisma.activity.create({
        data: {
          ticketId: ticket.id,
          action: ActivityAction.UPDATED,
          performedBy: assigneeId,
          fieldName: "status",
          previousValue: TicketStatus.OPEN,
          newValue: seedTicket.status,
        },
      });
    }

    for (const seedComment of seedTicket.comments) {
      const authorId = usersByEmail.get(seedComment.authorEmail);

      if (!authorId) {
        throw new Error(
          `Missing seed user for comment on ${seedTicket.ticketNumber}.`,
        );
      }

      await prisma.comment.create({
        data: {
          ticketId: ticket.id,
          authorId,
          message: seedComment.message,
        },
      });

      await prisma.activity.create({
        data: {
          ticketId: ticket.id,
          action: ActivityAction.COMMENT_ADDED,
          performedBy: authorId,
          fieldName: "comment",
          newValue: seedComment.message,
        },
      });
    }
  }
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

  await seedTickets();
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
