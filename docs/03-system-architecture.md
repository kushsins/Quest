# System Architecture

# Quest

> Modern Support Ticket Management Platform

**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** July 2026

---

# 1. Purpose

This document defines the high-level architecture of Quest, including the overall system structure, technology choices, module organization, and communication patterns.

Its purpose is to provide a clear engineering blueprint that promotes maintainability, scalability, and consistency throughout the application.

---

# 2. Architecture Goals

Quest is designed around the following architectural principles:

- Separation of concerns
- Modular feature development
- Scalable project structure
- Type safety
- Predictable data flow
- Reusable components
- Maintainable codebase

The architecture should remain simple enough for rapid development while providing a solid foundation for future product growth.

---

# 3. High-Level Architecture

Quest follows a client-server architecture.

```text
┌────────────────────────────┐
│       React (Vite)         │
│        Frontend            │
└─────────────┬──────────────┘
              │
         REST API (HTTPS)
              │
┌─────────────▼──────────────┐
│  Express + TypeScript API  │
└─────────────┬──────────────┘
              │
           Prisma ORM
              │
┌─────────────▼──────────────┐
│        PostgreSQL          │
└────────────────────────────┘
```

The frontend and backend remain independent applications that communicate exclusively through REST APIs.

---

# 4. Technology Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Axios

---

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

## Infrastructure

- Docker (PostgreSQL)
- Docker Compose
- Environment Variables

---

# 5. Repository Structure

Quest is maintained as a single repository containing both frontend and backend applications.

```text
quest/

├── client/
├── server/
├── docs/
├── docker/
├── .github/
└── README.md
```

This structure simplifies local development while keeping deployment flexible.

---

# 6. Frontend Architecture

The frontend follows a feature-based architecture.

Features own their components, business logic, hooks, and API interactions.

```text
client/src/

app/

features/

shared/

assets/
```

Typical feature modules include:

- Authentication
- Dashboard
- Tickets
- Comments

Shared modules contain reusable components, utilities, hooks, types, and helper functions used across multiple features.

---

# 7. Backend Architecture

The backend follows a modular architecture organized by business capability.

```text
server/src/

modules/

shared/

config/

middleware/
```

Each module encapsulates its own:

- Routes
- Controllers
- Services
- Validation
- Business logic
- Data access

This minimizes coupling between unrelated parts of the application.

---

# 8. Data Flow

Quest follows a predictable request lifecycle.

```text
User Interaction

↓

React Component

↓

TanStack Query / Axios

↓

REST API

↓

Express Route

↓

Controller

↓

Service

↓

Prisma

↓

PostgreSQL
```

Responses follow the same path in reverse until the UI is updated.

---

# 9. State Management

Quest separates application state according to responsibility.

| State Type | Solution |
|------------|----------|
| Server State | TanStack Query |
| Authentication | React Context |
| Theme | React Context |
| Forms | React Hook Form |
| Local UI State | React Hooks |

Redux is intentionally excluded to reduce unnecessary complexity.

---

# 10. Authentication

Quest uses JWT-based authentication with HttpOnly refresh token cookies.

Authentication consists of:

- **Access Token** — short-lived JWT returned in JSON, stored in frontend memory only, sent via `Authorization: Bearer` header
- **Refresh Token** — long-lived opaque token stored as an HttpOnly cookie, hashed in the database

The Access Token is included with every authenticated request. The backend validates the JWT and verifies the associated session on every protected request. User role and permissions are loaded from the database on each request.

The Refresh Token is used to obtain new Access Tokens without requiring users to log in again. Refresh requests read the token from the cookie, rotate it, and return only a new access token in the response.

Protected routes require successful authentication before granting access.

---

# 11. Authorization

Quest is designed around a Role-Based Access Control (RBAC) model.

Although the initial release supports only two system roles, the authorization layer is designed to support future expansion without architectural changes.

Authorization decisions are based on permissions rather than directly checking role names.

In Version 1, both Member and Manager roles are granted `VIEW_USERS` so authenticated users can retrieve the user list for assignment and display. Restrictive permissions such as `DELETE_TICKET` remain limited to elevated roles. Future administrative endpoints will introduce additional permissions without changing this read access model.

This separation allows future customization of roles while keeping authorization logic consistent.

---

# 12. Validation Strategy

Validation occurs on both the client and server.

Frontend validation improves user experience by providing immediate feedback.

Backend validation acts as the final security layer and protects the system from invalid or malicious requests.

Validation schemas should remain consistent across both applications whenever practical.

---

# 13. Error Handling

Quest uses centralized error handling.

The backend exposes consistent API responses for successful and failed requests.

Frontend components display appropriate feedback using:

- Toast notifications
- Inline validation
- Error messages
- Loading states

Unexpected errors should fail gracefully without exposing internal implementation details.

---

# 14. Logging

Application logging is abstracted behind a logging layer.

This allows the implementation to evolve without affecting business logic.

Initial development uses console logging via `server/src/shared/utils/logger.ts`.

Production logging can later be replaced by a dedicated logging solution without requiring widespread code changes.

---

# 15. Configuration Management

Application configuration is managed using environment variables.

Examples include:

- Database connection
- JWT secrets (`JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`)
- Token expiration (`ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`)
- API URLs
- Environment mode

Configuration values should never be hardcoded within the application.

---

# 16. Database Layer

Quest uses PostgreSQL as the primary relational database.

Prisma acts as the data access layer between the application and the database.

The ORM is responsible for:

- Type-safe database queries
- Schema management
- Database migrations
- Relationship mapping

---

# 17. API Communication

The frontend communicates with the backend exclusively through REST APIs.

All requests are performed using Axios.

Server state is managed using TanStack Query to provide:

- Request caching
- Background refetching
- Automatic synchronization
- Mutation handling

---

# 18. Security

Quest follows several core security practices.

These include:

- JWT Authentication
- Refresh Tokens
- Password hashing
- Protected API routes
- Input validation
- Permission-based authorization
- Secure environment configuration

Security should be considered throughout development rather than added after implementation.

---

# 19. Scalability

The architecture is designed to support future product growth.

Future enhancements may include:

- Additional modules
- Advanced role management
- Notifications
- Attachments
- Kanban boards
- Analytics
- Third-party integrations

The modular architecture minimizes the impact of introducing new functionality.

---

# 20. Engineering Principles

Development within Quest should follow these principles:

- Keep modules independent.
- Prefer composition over duplication.
- Build reusable components.
- Keep business logic out of UI components.
- Favor explicit code over hidden behavior.
- Write self-documenting code whenever possible.
- Optimize for maintainability before optimization.

Every architectural decision should contribute to a codebase that remains understandable and extensible as the product evolves.

---

# 21. Response Handling

Quest uses standardized response wrappers to ensure every API endpoint returns a consistent response structure.

The backend provides:

- `ApiResponse` for successful responses.
- `ApiError` for failed responses.
- A global error handling middleware that catches all exceptions and formats them into the standard API response.

This approach centralizes response handling, reduces duplicate code, and ensures consistency across all endpoints.