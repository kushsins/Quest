import type { Prisma } from "@prisma/client";
import { TicketPriority as TicketPriorityEnum } from "@prisma/client";

import { prisma } from "../../config/database.js";
import { ApiError } from "../../shared/errors/ApiError.js";
import { Permission } from "../../shared/constants/permissions.js";
import type { PermissionKey } from "../../shared/constants/permissions.js";
import {
  mapUserSummary,
  userSummarySelect,
} from "../../shared/mappers/user.mapper.js";
import {
  buildPaginationMeta,
  resolvePagination,
} from "../../shared/utils/pagination.util.js";
import { createActivity } from "./activity.service.js";
import {
  comparePriority,
  isValidStatusTransition,
  TICKET_NUMBER_PREFIX,
} from "./ticket.constants.js";
import type {
  CreateTicketResult,
  TicketDetail,
  TicketListItem,
  TicketWithUsers,
} from "./ticket.types.js";
import type {
  CreateTicketInput,
  ListTicketsQuery,
  UpdateTicketInput,
} from "./ticket.validation.js";

const ticketListInclude = {
  reporter: { select: userSummarySelect },
  assignee: { select: userSummarySelect },
} as const;

const ticketDetailInclude = {
  reporter: { select: userSummarySelect },
  assignee: { select: userSummarySelect },
  comments: {
    orderBy: { createdAt: "desc" as const },
    include: {
      author: { select: userSummarySelect },
    },
  },
  activities: {
    orderBy: { createdAt: "asc" as const },
    include: {
      performer: { select: userSummarySelect },
    },
  },
} as const;

function mapTicketListItem(ticket: TicketWithUsers): TicketListItem {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    reporter: mapUserSummary(ticket.reporter),
    assignee: mapUserSummary(ticket.assignee),
    createdAt: ticket.createdAt.toISOString(),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

function mapTicketDetail(
  ticket: Prisma.TicketGetPayload<{ include: typeof ticketDetailInclude }>,
): TicketDetail {
  return {
    ...mapTicketListItem(ticket),
    comments: ticket.comments.map((comment) => ({
      id: comment.id,
      author: mapUserSummary(comment.author),
      message: comment.message,
      createdAt: comment.createdAt.toISOString(),
    })),
    activities: ticket.activities.map((activity) => ({
      id: activity.id,
      action: activity.action,
      fieldName: activity.fieldName,
      previousValue: activity.previousValue,
      newValue: activity.newValue,
      performedBy: mapUserSummary(activity.performer),
      createdAt: activity.createdAt.toISOString(),
    })),
  };
}

async function generateTicketNumber(
  transaction: Prisma.TransactionClient,
): Promise<string> {
  const latestTicket = await transaction.ticket.findFirst({
    orderBy: { ticketNumber: "desc" },
    select: { ticketNumber: true },
  });

  const latestNumber = latestTicket
    ? Number.parseInt(latestTicket.ticketNumber.replace(TICKET_NUMBER_PREFIX, ""), 10)
    : 0;

  const nextNumber = latestNumber + 1;
  return `${TICKET_NUMBER_PREFIX}${String(nextNumber).padStart(3, "0")}`;
}

async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
}

function buildTicketWhere(
  query: ListTicketsQuery,
  currentUserId: string,
): Prisma.TicketWhereInput {
  const where: Prisma.TicketWhereInput = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.priority) {
    where.priority = query.priority;
  }

  if (query.assignee) {
    where.assigneeId =
      query.assignee === "me" ? currentUserId : query.assignee;
  }

  if (query.search) {
    where.OR = [
      { ticketNumber: { contains: query.search, mode: "insensitive" } },
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
}

async function listTicketsWithStandardSort(
  where: Prisma.TicketWhereInput,
  query: ListTicketsQuery,
) {
  const pagination = resolvePagination(query);

  const orderBy: Prisma.TicketOrderByWithRelationInput = {
    [query.sortBy]: query.sortOrder,
  };

  const [tickets, totalItems] = await Promise.all([
    prisma.ticket.findMany({
      where,
      include: ticketListInclude,
      orderBy,
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.ticket.count({ where }),
  ]);

  return {
    items: tickets.map(mapTicketListItem),
    pagination: buildPaginationMeta(pagination, totalItems),
  };
}

async function listTicketsWithPrioritySort(
  where: Prisma.TicketWhereInput,
  query: ListTicketsQuery,
) {
  const pagination = resolvePagination(query);

  const [matchingTickets, totalItems] = await Promise.all([
    prisma.ticket.findMany({
      where,
      select: { id: true, priority: true },
    }),
    prisma.ticket.count({ where }),
  ]);

  const sortedIds = matchingTickets
    .sort((left, right) =>
      comparePriority(left.priority, right.priority, query.sortOrder),
    )
    .slice(pagination.skip, pagination.skip + pagination.take)
    .map((ticket) => ticket.id);

  if (sortedIds.length === 0) {
    return {
      items: [],
      pagination: buildPaginationMeta(pagination, totalItems),
    };
  }

  const tickets = await prisma.ticket.findMany({
    where: { id: { in: sortedIds } },
    include: ticketListInclude,
  });

  const ticketMap = new Map(tickets.map((ticket) => [ticket.id, ticket]));

  return {
    items: sortedIds
      .map((id) => ticketMap.get(id))
      .filter((ticket): ticket is TicketWithUsers => ticket !== undefined)
      .map(mapTicketListItem),
    pagination: buildPaginationMeta(pagination, totalItems),
  };
}

export async function listTickets(query: ListTicketsQuery, currentUserId: string) {
  const where = buildTicketWhere(query, currentUserId);

  if (query.sortBy === "priority") {
    return listTicketsWithPrioritySort(where, query);
  }

  return listTicketsWithStandardSort(where, query);
}

export async function getTicketById(ticketId: string): Promise<TicketDetail> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: ticketDetailInclude,
  });

  if (!ticket) {
    throw new ApiError(404, "Ticket not found.");
  }

  return mapTicketDetail(ticket);
}

function assertAssignPermission(
  permissions: PermissionKey[],
  assigneeId: string,
  reporterId: string,
): void {
  if (assigneeId !== reporterId && !permissions.includes(Permission.ASSIGN_TICKET)) {
    throw new ApiError(403, "You don't have permission to assign tickets.");
  }
}

export async function createTicket(
  input: CreateTicketInput,
  reporterId: string,
  permissions: PermissionKey[],
): Promise<CreateTicketResult> {
  const assigneeId = input.assigneeId ?? reporterId;

  const assignee = await findUserById(assigneeId);

  if (!assignee) {
    throw new ApiError(422, "The selected assignee does not exist.", [
      { field: "assigneeId", message: "The selected assignee does not exist." },
    ]);
  }

  assertAssignPermission(permissions, assigneeId, reporterId);

  return prisma.$transaction(async (transaction) => {
    const ticketNumber = await generateTicketNumber(transaction);

    const ticket = await transaction.ticket.create({
      data: {
        ticketNumber,
        title: input.title,
        description: input.description,
        priority: input.priority ?? TicketPriorityEnum.MEDIUM,
        reporterId,
        assigneeId,
      },
    });

    await createActivity(
      {
        ticketId: ticket.id,
        action: "CREATED",
        performedBy: reporterId,
      },
      transaction,
    );

    if (assigneeId !== reporterId) {
      await createActivity(
        {
          ticketId: ticket.id,
          action: "UPDATED",
          performedBy: reporterId,
          fieldName: "assignee",
          previousValue: reporterId,
          newValue: assigneeId,
        },
        transaction,
      );
    }

    return {
      id: ticket.id,
      ticketNumber: ticket.ticketNumber,
    };
  });
}

type TrackableTicketField =
  | "title"
  | "description"
  | "status"
  | "priority"
  | "assignee"
  | "reporter";

async function createFieldUpdateActivities(
  ticketId: string,
  performedBy: string,
  changes: Array<{
    fieldName: TrackableTicketField;
    previousValue: string | null;
    newValue: string | null;
  }>,
  transaction: Prisma.TransactionClient,
): Promise<void> {
  await Promise.all(
    changes.map((change) =>
      createActivity(
        {
          ticketId,
          action: "UPDATED",
          performedBy,
          fieldName: change.fieldName,
          previousValue: change.previousValue,
          newValue: change.newValue,
        },
        transaction,
      ),
    ),
  );
}

export async function updateTicket(
  ticketId: string,
  input: UpdateTicketInput,
  performedBy: string,
  permissions: PermissionKey[],
): Promise<void> {
  const existingTicket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!existingTicket) {
    throw new ApiError(404, "Ticket not found.");
  }

  if (input.assigneeId !== undefined) {
    if (!permissions.includes(Permission.ASSIGN_TICKET)) {
      throw new ApiError(403, "You don't have permission to assign tickets.");
    }

    const assignee = await findUserById(input.assigneeId);

    if (!assignee) {
      throw new ApiError(422, "The selected assignee does not exist.", [
        { field: "assigneeId", message: "The selected assignee does not exist." },
      ]);
    }
  }

  if (input.reporterId !== undefined) {
    if (!permissions.includes(Permission.UPDATE_TICKET)) {
      throw new ApiError(403, "You don't have permission to update tickets.");
    }

    const reporter = await findUserById(input.reporterId);

    if (!reporter) {
      throw new ApiError(422, "The selected reporter does not exist.", [
        { field: "reporterId", message: "The selected reporter does not exist." },
      ]);
    }
  }

  if (
    input.status !== undefined &&
    !isValidStatusTransition(existingTicket.status, input.status)
  ) {
    throw new ApiError(
      422,
      "This status change is not allowed for the current ticket workflow.",
      [
        {
          field: "status",
          message: "This status change is not allowed for the current ticket workflow.",
        },
      ],
    );
  }

  const changes: Array<{
    fieldName: TrackableTicketField;
    previousValue: string | null;
    newValue: string | null;
  }> = [];

  if (input.title !== undefined && input.title !== existingTicket.title) {
    changes.push({
      fieldName: "title",
      previousValue: existingTicket.title,
      newValue: input.title,
    });
  }

  if (
    input.description !== undefined &&
    input.description !== (existingTicket.description ?? "")
  ) {
    changes.push({
      fieldName: "description",
      previousValue: existingTicket.description,
      newValue: input.description,
    });
  }

  if (input.status !== undefined && input.status !== existingTicket.status) {
    changes.push({
      fieldName: "status",
      previousValue: existingTicket.status,
      newValue: input.status,
    });
  }

  if (
    input.priority !== undefined &&
    input.priority !== existingTicket.priority
  ) {
    changes.push({
      fieldName: "priority",
      previousValue: existingTicket.priority,
      newValue: input.priority,
    });
  }

  if (
    input.assigneeId !== undefined &&
    input.assigneeId !== existingTicket.assigneeId
  ) {
    changes.push({
      fieldName: "assignee",
      previousValue: existingTicket.assigneeId,
      newValue: input.assigneeId,
    });
  }

  if (
    input.reporterId !== undefined &&
    input.reporterId !== existingTicket.reporterId
  ) {
    changes.push({
      fieldName: "reporter",
      previousValue: existingTicket.reporterId,
      newValue: input.reporterId,
    });
  }

  if (changes.length === 0) {
    return;
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.ticket.update({
      where: { id: ticketId },
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
        priority: input.priority,
        assigneeId: input.assigneeId,
        reporterId: input.reporterId,
      },
    });

    await createFieldUpdateActivities(
      ticketId,
      performedBy,
      changes,
      transaction,
    );
  });
}

export async function deleteTicket(ticketId: string): Promise<void> {
  const existingTicket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true },
  });

  if (!existingTicket) {
    throw new ApiError(404, "Ticket not found.");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.comment.deleteMany({ where: { ticketId } });
    await transaction.activity.deleteMany({ where: { ticketId } });
    await transaction.ticket.delete({ where: { id: ticketId } });
  });
}

export async function assertTicketExists(ticketId: string): Promise<void> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true },
  });

  if (!ticket) {
    throw new ApiError(404, "Ticket not found.");
  }
}

