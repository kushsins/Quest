import path from "node:path";
import { fileURLToPath } from "node:url";

import swaggerJsdoc from "swagger-jsdoc";

import { ALL_PERMISSIONS } from "../shared/constants/permissions.js";
import { TICKET_SORT_FIELDS } from "../modules/tickets/ticket.constants.js";

const docsDir = path.dirname(fileURLToPath(import.meta.url));
const pathsFile =
  process.env.NODE_ENV === "production" ? "paths.openapi.js" : "paths.openapi.ts";

const permissionEnum = ALL_PERMISSIONS;
const ticketSortEnum = [...TICKET_SORT_FIELDS];

const definition = {
  openapi: "3.0.3",
  info: {
    title: "Quest API",
    version: "1.0.0",
    description:
      "REST API for Quest — a modern support ticket management platform.",
  },
  servers: [
    {
      url: "/api/v1",
      description: "API v1",
    },
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Authentication", description: "Login, session, and user profile" },
    { name: "Dashboard", description: "Dashboard statistics and summaries" },
    { name: "Tickets", description: "Ticket lifecycle management" },
    { name: "Comments", description: "Ticket comments" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT access token obtained from login or refresh.",
      },
      refreshCookie: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
        description:
          "HttpOnly refresh token cookie set by login and refresh endpoints.",
      },
    },
    schemas: {
      FieldError: {
        type: "object",
        required: ["field", "message"],
        properties: {
          field: { type: "string", example: "title" },
          message: { type: "string", example: "Title is required." },
        },
      },
      ApiErrorResponse: {
        type: "object",
        required: ["success", "message", "errors"],
        properties: {
          success: { type: "boolean", enum: [false] },
          message: { type: "string" },
          errors: {
            type: "array",
            items: { $ref: "#/components/schemas/FieldError" },
          },
        },
      },
      AuthRole: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: { type: "integer", example: 2 },
          name: { type: "string", example: "Manager" },
        },
      },
      PermissionKey: {
        type: "string",
        enum: permissionEnum,
      },
      AuthUser: {
        type: "object",
        required: ["id", "name", "email", "role", "permissions"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "manager@quest.com" },
          role: { $ref: "#/components/schemas/AuthRole" },
          permissions: {
            type: "array",
            items: { $ref: "#/components/schemas/PermissionKey" },
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "manager@quest.com",
          },
          password: { type: "string", format: "password", example: "password123" },
        },
      },
      LoginData: {
        type: "object",
        required: ["accessToken", "user"],
        properties: {
          accessToken: { type: "string", description: "JWT access token" },
          user: { $ref: "#/components/schemas/AuthUser" },
        },
      },
      RefreshData: {
        type: "object",
        required: ["accessToken"],
        properties: {
          accessToken: { type: "string", description: "New JWT access token" },
        },
      },
      UserSummary: {
        type: "object",
        required: ["id", "name", "email", "role"],
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "John Doe" },
          email: { type: "string", format: "email", example: "john@quest.com" },
          role: { $ref: "#/components/schemas/AuthRole" },
        },
      },
      TicketStatus: {
        type: "string",
        enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"],
      },
      TicketPriority: {
        type: "string",
        enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      },
      ActivityAction: {
        type: "string",
        enum: ["CREATED", "UPDATED", "DELETED", "COMMENT_ADDED"],
      },
      PaginationMeta: {
        type: "object",
        required: ["page", "limit", "totalItems", "totalPages"],
        properties: {
          page: { type: "integer", minimum: 1, example: 1 },
          limit: { type: "integer", minimum: 1, maximum: 100, example: 20 },
          totalItems: { type: "integer", minimum: 0, example: 126 },
          totalPages: { type: "integer", minimum: 0, example: 7 },
        },
      },
      TicketListItem: {
        type: "object",
        required: [
          "id",
          "ticketNumber",
          "title",
          "description",
          "status",
          "priority",
          "reporter",
          "assignee",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          ticketNumber: { type: "string", example: "QST-001" },
          title: { type: "string", example: "Unable to login" },
          description: { type: "string", nullable: true },
          status: { $ref: "#/components/schemas/TicketStatus" },
          priority: { $ref: "#/components/schemas/TicketPriority" },
          reporter: { $ref: "#/components/schemas/UserSummary" },
          assignee: { $ref: "#/components/schemas/UserSummary" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      PaginatedTicketList: {
        type: "object",
        required: ["items", "pagination"],
        properties: {
          items: {
            type: "array",
            items: { $ref: "#/components/schemas/TicketListItem" },
          },
          pagination: { $ref: "#/components/schemas/PaginationMeta" },
        },
      },
      CommentItem: {
        type: "object",
        required: ["id", "author", "message", "createdAt"],
        properties: {
          id: { type: "string", format: "uuid" },
          author: { $ref: "#/components/schemas/UserSummary" },
          message: { type: "string", example: "Working on this issue." },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      ActivityItem: {
        type: "object",
        required: [
          "id",
          "action",
          "fieldName",
          "previousValue",
          "newValue",
          "performedBy",
          "createdAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          action: { $ref: "#/components/schemas/ActivityAction" },
          fieldName: { type: "string", nullable: true },
          previousValue: { type: "string", nullable: true },
          newValue: { type: "string", nullable: true },
          performedBy: { $ref: "#/components/schemas/UserSummary" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      TicketDetail: {
        allOf: [
          { $ref: "#/components/schemas/TicketListItem" },
          {
            type: "object",
            required: ["comments", "activities"],
            properties: {
              comments: {
                type: "array",
                items: { $ref: "#/components/schemas/CommentItem" },
              },
              activities: {
                type: "array",
                items: { $ref: "#/components/schemas/ActivityItem" },
              },
            },
          },
        ],
      },
      CreateTicketRequest: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", maxLength: 255, example: "Unable to login" },
          description: {
            type: "string",
            example: "User cannot login after password reset.",
          },
          priority: { $ref: "#/components/schemas/TicketPriority" },
          assigneeId: { type: "string", format: "uuid" },
        },
      },
      UpdateTicketRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          title: { type: "string", maxLength: 255 },
          description: { type: "string" },
          status: { $ref: "#/components/schemas/TicketStatus" },
          priority: { $ref: "#/components/schemas/TicketPriority" },
          assigneeId: { type: "string", format: "uuid" },
          reporterId: { type: "string", format: "uuid" },
        },
      },
      CreateTicketResult: {
        type: "object",
        required: ["id", "ticketNumber"],
        properties: {
          id: { type: "string", format: "uuid" },
          ticketNumber: { type: "string", example: "QST-025" },
        },
      },
      CreateCommentRequest: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            minLength: 1,
            maxLength: 5000,
            example: "Issue has been reproduced.",
          },
        },
      },
      HealthStatus: {
        type: "object",
        required: ["status", "database", "timestamp"],
        properties: {
          status: { type: "string", enum: ["ok"], example: "ok" },
          database: { type: "boolean", example: true },
          timestamp: { type: "string", format: "date-time" },
        },
      },
      DashboardStatistics: {
        type: "object",
        required: [
          "totalTickets",
          "myTickets",
          "open",
          "inProgress",
          "resolved",
          "closed",
          "cancelled",
        ],
        properties: {
          totalTickets: { type: "integer", example: 128 },
          myTickets: { type: "integer", example: 16 },
          open: { type: "integer", example: 34 },
          inProgress: { type: "integer", example: 28 },
          resolved: { type: "integer", example: 42 },
          closed: { type: "integer", example: 16 },
          cancelled: { type: "integer", example: 8 },
        },
      },
      DashboardTicketSummary: {
        type: "object",
        required: [
          "id",
          "ticketNumber",
          "title",
          "status",
          "priority",
          "assignee",
          "updatedAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          ticketNumber: { type: "string", example: "QST-001" },
          title: { type: "string" },
          status: { $ref: "#/components/schemas/TicketStatus" },
          priority: { $ref: "#/components/schemas/TicketPriority" },
          assignee: { $ref: "#/components/schemas/UserSummary" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      DashboardActivityItem: {
        allOf: [
          { $ref: "#/components/schemas/ActivityItem" },
          {
            type: "object",
            required: ["ticket"],
            properties: {
              ticket: {
                type: "object",
                required: ["id", "ticketNumber", "title"],
                properties: {
                  id: { type: "string", format: "uuid" },
                  ticketNumber: { type: "string", example: "QST-001" },
                  title: { type: "string" },
                },
              },
            },
          },
        ],
      },
      DashboardData: {
        type: "object",
        required: [
          "statistics",
          "statusDistribution",
          "priorityDistribution",
          "recentActivity",
          "myAssignedTickets",
          "recentlyUpdatedTickets",
          "referencedUsers",
        ],
        properties: {
          statistics: { $ref: "#/components/schemas/DashboardStatistics" },
          statusDistribution: {
            type: "object",
            additionalProperties: { type: "integer" },
            example: {
              OPEN: 34,
              IN_PROGRESS: 28,
              RESOLVED: 42,
              CLOSED: 16,
              CANCELLED: 8,
            },
          },
          priorityDistribution: {
            type: "object",
            additionalProperties: { type: "integer" },
            example: {
              LOW: 24,
              MEDIUM: 52,
              HIGH: 38,
              URGENT: 14,
            },
          },
          recentActivity: {
            type: "array",
            items: { $ref: "#/components/schemas/DashboardActivityItem" },
          },
          myAssignedTickets: {
            type: "array",
            items: { $ref: "#/components/schemas/DashboardTicketSummary" },
          },
          recentlyUpdatedTickets: {
            type: "array",
            items: { $ref: "#/components/schemas/DashboardTicketSummary" },
          },
          referencedUsers: {
            type: "array",
            items: { $ref: "#/components/schemas/UserSummary" },
          },
        },
      },
      EmptyObject: {
        type: "object",
        additionalProperties: false,
      },
      TicketSortField: {
        type: "string",
        enum: ticketSortEnum,
      },
      SortOrder: {
        type: "string",
        enum: ["asc", "desc"],
        default: "desc",
      },
    },
    responses: {
      Unauthorized: {
        description: "Authentication required or session expired.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            examples: {
              required: {
                value: {
                  success: false,
                  message: "Authentication required.",
                  errors: [],
                },
              },
              expired: {
                value: {
                  success: false,
                  message: "Your session has expired. Please sign in again.",
                  errors: [],
                },
              },
            },
          },
        },
      },
      Forbidden: {
        description: "Permission denied.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: {
              success: false,
              message: "You don't have permission to perform this action.",
              errors: [],
            },
          },
        },
      },
      NotFound: {
        description: "Resource not found.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: {
              success: false,
              message: "Ticket not found.",
              errors: [],
            },
          },
        },
      },
      ValidationError: {
        description: "Validation failed.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: {
              success: false,
              message: "Please correct the highlighted fields.",
              errors: [{ field: "title", message: "Title is required." }],
            },
          },
        },
      },
      InternalError: {
        description: "Unexpected server error.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: {
              success: false,
              message: "An unexpected error occurred.",
              errors: [],
            },
          },
        },
      },
      ServiceUnavailable: {
        description: "Service temporarily unavailable.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ApiErrorResponse" },
            example: {
              success: false,
              message: "Service is temporarily unavailable.",
              errors: [],
            },
          },
        },
      },
    },
  },
} as const;

export const openApiSpec = swaggerJsdoc({
  definition,
  apis: [path.join(docsDir, pathsFile)],
});
