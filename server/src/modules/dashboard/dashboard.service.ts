import type { TicketPriority, TicketStatus } from "@prisma/client";

import { prisma } from "../../config/database.js";
import {
  mapUserSummary,
  userSummarySelect,
} from "../../shared/mappers/user.mapper.js";
import type {
  DashboardActivityItem,
  DashboardData,
  DashboardStatistics,
  DashboardTicketSummary,
} from "./dashboard.types.js";

const TICKET_LIST_LIMIT = 5;
const ACTIVITY_LIMIT = 15;

const ticketSummaryInclude = {
  assignee: { select: userSummarySelect },
} as const;

const ALL_STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
  "CANCELLED",
];

const ALL_PRIORITIES: TicketPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
];

function mapTicketSummary(
  ticket: {
    id: string;
    ticketNumber: string;
    title: string;
    status: TicketStatus;
    priority: TicketPriority;
    updatedAt: Date;
    assignee: Parameters<typeof mapUserSummary>[0];
  },
): DashboardTicketSummary {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    assignee: mapUserSummary(ticket.assignee),
    updatedAt: ticket.updatedAt.toISOString(),
  };
}

function buildStatistics(
  totalTickets: number,
  myTickets: number,
  statusCounts: Array<{ status: TicketStatus; _count: { status: number } }>,
): DashboardStatistics {
  const countByStatus = new Map(
    statusCounts.map((entry) => [entry.status, entry._count.status]),
  );

  return {
    totalTickets,
    myTickets,
    open: countByStatus.get("OPEN") ?? 0,
    inProgress: countByStatus.get("IN_PROGRESS") ?? 0,
    resolved: countByStatus.get("RESOLVED") ?? 0,
    closed: countByStatus.get("CLOSED") ?? 0,
    cancelled: countByStatus.get("CANCELLED") ?? 0,
  };
}

function buildStatusDistribution(
  statusCounts: Array<{ status: TicketStatus; _count: { status: number } }>,
): Record<TicketStatus, number> {
  const distribution = Object.fromEntries(
    ALL_STATUSES.map((status) => [status, 0]),
  ) as Record<TicketStatus, number>;

  for (const entry of statusCounts) {
    distribution[entry.status] = entry._count.status;
  }

  return distribution;
}

function buildPriorityDistribution(
  priorityCounts: Array<{ priority: TicketPriority; _count: { priority: number } }>,
): Record<TicketPriority, number> {
  const distribution = Object.fromEntries(
    ALL_PRIORITIES.map((priority) => [priority, 0]),
  ) as Record<TicketPriority, number>;

  for (const entry of priorityCounts) {
    distribution[entry.priority] = entry._count.priority;
  }

  return distribution;
}

function isUserReferenceField(fieldName: string | null): boolean {
  return (
    fieldName === "assignee" ||
    fieldName === "assigneeId" ||
    fieldName === "reporter" ||
    fieldName === "reporterId"
  );
}

function collectReferencedUserIds(
  activities: Array<{
    fieldName: string | null;
    previousValue: string | null;
    newValue: string | null;
  }>,
): string[] {
  const ids = new Set<string>();

  for (const activity of activities) {
    if (!isUserReferenceField(activity.fieldName)) {
      continue;
    }

    if (activity.previousValue) {
      ids.add(activity.previousValue);
    }

    if (activity.newValue) {
      ids.add(activity.newValue);
    }
  }

  return [...ids];
}

export async function getDashboard(userId: string): Promise<DashboardData> {
  const [
    totalTickets,
    myTickets,
    statusCounts,
    priorityCounts,
    myAssignedTickets,
    recentlyUpdatedTickets,
    recentActivities,
  ] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { assigneeId: userId } }),
    prisma.ticket.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.ticket.groupBy({
      by: ["priority"],
      _count: { priority: true },
    }),
    prisma.ticket.findMany({
      where: { assigneeId: userId },
      orderBy: { updatedAt: "desc" },
      take: TICKET_LIST_LIMIT,
      include: ticketSummaryInclude,
    }),
    prisma.ticket.findMany({
      orderBy: { updatedAt: "desc" },
      take: TICKET_LIST_LIMIT,
      include: ticketSummaryInclude,
    }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: ACTIVITY_LIMIT,
      include: {
        performer: { select: userSummarySelect },
        ticket: {
          select: {
            id: true,
            ticketNumber: true,
            title: true,
          },
        },
      },
    }),
  ]);

  const referencedUserIds = collectReferencedUserIds(recentActivities);
  const referencedUsers =
    referencedUserIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: referencedUserIds } },
          select: userSummarySelect,
        })
      : [];

  const statistics = buildStatistics(totalTickets, myTickets, statusCounts);

  return {
    statistics,
    statusDistribution: buildStatusDistribution(statusCounts),
    priorityDistribution: buildPriorityDistribution(priorityCounts),
    myAssignedTickets: myAssignedTickets.map(mapTicketSummary),
    recentlyUpdatedTickets: recentlyUpdatedTickets.map(mapTicketSummary),
    recentActivity: recentActivities.map(
      (activity): DashboardActivityItem => ({
        id: activity.id,
        action: activity.action,
        fieldName: activity.fieldName,
        previousValue: activity.previousValue,
        newValue: activity.newValue,
        performedBy: mapUserSummary(activity.performer),
        createdAt: activity.createdAt.toISOString(),
        ticket: {
          id: activity.ticket.id,
          ticketNumber: activity.ticket.ticketNumber,
          title: activity.ticket.title,
        },
      }),
    ),
    referencedUsers: referencedUsers.map(mapUserSummary),
  };
}
