import { PrismaClient, TicketPriority, TicketStatus } from "@prisma/client";

import { TEST_USERS } from "../helpers/fixtures.js";

let prisma: PrismaClient | undefined;

export function getTestPrisma(): PrismaClient {
  prisma ??= new PrismaClient();
  return prisma;
}

export interface SeededTestData {
  memberId: string;
  managerId: string;
  openTicketId: string;
  openTicketNumber: string;
  inProgressTicketId: string;
}

async function seedTestTickets(client: PrismaClient): Promise<SeededTestData> {
  const users = await client.user.findMany({
    where: {
      email: {
        in: [TEST_USERS.member.email, TEST_USERS.manager.email],
      },
    },
    select: { id: true, email: true },
  });

  const member = users.find((user) => user.email === TEST_USERS.member.email);
  const manager = users.find((user) => user.email === TEST_USERS.manager.email);

  if (!member || !manager) {
    throw new Error("Seed users are missing from the test database.");
  }

  const openTicket = await client.ticket.create({
    data: {
      ticketNumber: "QST-001",
      title: "Integration test open ticket",
      description: "Used for read and update integration tests.",
      status: TicketStatus.OPEN,
      priority: TicketPriority.MEDIUM,
      reporterId: member.id,
      assigneeId: member.id,
    },
  });

  const inProgressTicket = await client.ticket.create({
    data: {
      ticketNumber: "QST-002",
      title: "Integration test in-progress ticket",
      description: "Used for status transition integration tests.",
      status: TicketStatus.IN_PROGRESS,
      priority: TicketPriority.HIGH,
      reporterId: manager.id,
      assigneeId: member.id,
    },
  });

  await client.activity.createMany({
    data: [
      {
        ticketId: openTicket.id,
        action: "CREATED",
        performedBy: member.id,
      },
      {
        ticketId: inProgressTicket.id,
        action: "CREATED",
        performedBy: manager.id,
      },
    ],
  });

  return {
    memberId: member.id,
    managerId: manager.id,
    openTicketId: openTicket.id,
    openTicketNumber: openTicket.ticketNumber,
    inProgressTicketId: inProgressTicket.id,
  };
}

export async function resetTestDatabase(): Promise<SeededTestData> {
  const client = getTestPrisma();

  await client.session.deleteMany();
  await client.comment.deleteMany();
  await client.activity.deleteMany();
  await client.ticket.deleteMany();

  return seedTestTickets(client);
}

export async function disconnectTestDatabase(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
    prisma = undefined;
  }
}
