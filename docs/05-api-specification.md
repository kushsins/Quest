# API Specification

# Quest

> Modern Support Ticket Management Platform

**Version:** 1.0.0  
**API Version:** v1  
**Status:** Final  
**Architecture:** REST API

---

# 1. Purpose

This document defines the REST API contract for Quest.

It specifies how the frontend communicates with the backend by defining request formats, response structures, authentication, authorization, endpoints, and error handling.

This document serves as the single source of truth for backend and frontend integration.

---

# 2. API Design Principles

Quest follows a RESTful API architecture with predictable endpoint naming, standardized response structures, and stateless authentication.

The API has been designed around the following principles.

- RESTful resource naming
- Consistent request and response formats
- JWT-based authentication
- Role-Based Access Control (RBAC)
- User-friendly error messages
- Standard HTTP status codes
- Stateless Access Tokens
- Session-based Refresh Tokens
- Versioned APIs
- Backend as the single source of truth

---

# 3. Base URL

```
/api/v1
```

All endpoints defined in this document are relative to the API version above.

Example

```
GET /api/v1/tickets
```

---

# 4. Authentication

Quest uses JWT Authentication with Access Tokens and Refresh Tokens.

## Access Token

The Access Token is a short-lived JWT used to authenticate protected API requests.

The frontend stores the access token **in memory only**. It must not be stored in `localStorage`, `sessionStorage`, cookies, or the database.

The frontend must include the token in the Authorization header.

Example

```http
Authorization: Bearer <access_token>
```

The backend validates the token before processing every protected request. On each authenticated request, the backend also verifies that the session referenced by the token still exists, is not revoked, and has not expired. User role and permissions are loaded from the database on every request.

Access Tokens are **not stored** in the database.

The JWT payload is minimal:

```json
{
    "sub": "<user_id>",
    "sid": "<session_id>",
    "iat": 0,
    "exp": 0
}
```

---

## Refresh Token

Refresh Tokens are long-lived opaque tokens associated with authenticated sessions.

Each successful login creates a new session.

The refresh token is hashed using `SHA-256(refreshToken + serverPepper)` and stored in the database. Only the hash is persisted.

The refresh token is delivered to the client as an **HttpOnly cookie** named `refreshToken`. It is never returned in JSON responses.

Cookie configuration:

| Attribute | Value |
|-----------|-------|
| `HttpOnly` | `true` |
| `Secure` | `true` in production |
| `SameSite` | `Lax` |
| `Path` | `/` |
| `Max-Age` | `REFRESH_TOKEN_EXPIRES_IN` |

This enables:

- Multiple concurrent logins
- Independent device sessions
- Refresh Token rotation
- Single-session logout
- Logout from all sessions (future)

---

## Authentication Flow

```
Login
    │
    ▼
Access Token (JSON response)
Refresh Token (HttpOnly Cookie)
    │
    ▼
Store Hashed Refresh Token
inside Session
```

Whenever the Access Token expires:

```
401 Unauthorized
        │
        ▼
POST /auth/refresh
(cookie: refreshToken)
        │
        ▼
New Access Token (JSON response)
New Refresh Token (HttpOnly Cookie)
        │
        ▼
Retry Original Request
```

On logout, the current session is revoked and the refresh token cookie is cleared. Other device sessions remain active.

---

# 5. Authorization

Authentication determines **who the user is**.

Authorization determines **what the user is allowed to do**.

Quest implements Role-Based Access Control (RBAC).

Permissions are assigned to Roles.

Roles are assigned to Users.

Example

```
User

↓

Role

↓

Permissions

↓

API Access
```

Every protected endpoint specifies the required permission.

Example

```
DELETE /tickets/:id

Requires

DELETE_TICKET
```

If the authenticated user lacks the required permission, the server responds with:

```
403 Forbidden
```

---

# 6. Request Headers

## Public Endpoints

```
Content-Type: application/json
```

---

## Protected Endpoints

```
Content-Type: application/json

Authorization: Bearer <access_token>
```

Protected refresh requests must include credentials so the browser sends the HttpOnly refresh token cookie.

---

# 7. Standard API Response

Every endpoint returns a consistent response structure.

## Success Response

```json
{
    "success": true,
    "message": "Ticket created successfully.",
    "data": {}
}
```

## Error Response

```json
{
    "success": false,
    "message": "The email or password you entered is incorrect.",
    "errors": []
}
```

## Validation Error Response

```json
{
    "success": false,
    "message": "Please correct the highlighted fields.",
    "errors": [
        {
            "field": "title",
            "message": "Title is required."
        }
    ]
}
```

**Response Guidelines**

- `message` contains a user-friendly message and can be displayed directly in the UI.
- `data` is present only for successful responses.
- `errors` contains field-level validation errors and is empty for non-validation errors.
- HTTP Status Codes indicate the type of error (401, 403, 404, 422, etc.).

---

# 8. Error Handling

Quest prioritizes user-friendly error messages.

Messages returned by the API are intended to be displayed directly in the user interface.

Examples

Instead of

```
Validation Failed
```

Return

```
Please correct the highlighted fields.
```

Instead of

```
Invalid Credentials
```

Return

```
The email or password you entered is incorrect.
```

Instead of

```
Unauthorized
```

Return

```
Your session has expired. Please sign in again.
```

The optional `errors` array is primarily used for field-level validation and form feedback.

---

# 9. HTTP Status Codes

Quest follows standard HTTP status codes.

| Status | Description |
|---------|-------------|
| 200 | Request completed successfully |
| 201 | Resource created successfully |
| 204 | Request completed with no response body |
| 400 | Invalid request |
| 401 | Authentication required or token expired |
| 403 | Permission denied |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation failed |
| 500 | Internal server error |
| 503 | Service unavailable (e.g. database disconnected) |

---

# 10. Pagination

Collection endpoints support pagination.

Query Parameters

```
?page=1

&limit=20
```

Example

```
GET /tickets?page=2&limit=20
```

Responses include pagination metadata.

Example

```json
{
    "success": true,
    "message": "Tickets retrieved successfully.",
    "data": {
        "items": [],
        "pagination": {
            "page": 2,
            "limit": 20,
            "totalItems": 148,
            "totalPages": 8
        }
    }
}
```

---

# 11. Searching & Filtering

Quest uses query parameters for searching and filtering resources.

Example

```
GET /tickets?search=login
```

Combined filters

```
GET /tickets

?search=login

&status=OPEN

&priority=HIGH

&page=1

&limit=20

&sortBy=updatedAt

&sortOrder=desc
```

Supported query parameters vary by endpoint and are documented individually.

---

# 12. Sorting

Sorting follows a common pattern across all collection endpoints.

Example

```
GET /tickets

?sortBy=updatedAt

&sortOrder=desc
```

Supported values are documented for each endpoint.

---

# 13. Endpoint Categories

Quest currently exposes the following API groups.

- Health
- Authentication
- Dashboard
- Users
- Tickets
- Comments

Each group is described in the following sections.

---

# 14. Health Endpoints

Health endpoints verify application and infrastructure availability.

They are used during development, deployment health checks, and monitoring.

---

## Get Health

Returns the current health status of the API and its database connection.

### Endpoint

```http
GET /api/v1/health
```

### Authentication

Not Required

### Success Response

**Status Code**

```
200 OK
```

```json
{
    "success": true,
    "message": "Service is healthy.",
    "data": {
        "status": "ok",
        "database": true,
        "timestamp": "2026-07-10T12:00:00.000Z"
    }
}
```

### Response Fields

| Field | Description |
|-------|-------------|
| `status` | Overall service status (`ok` when the API is running) |
| `database` | Database connectivity status (`true` when connected, `false` when disconnected) |
| `timestamp` | ISO 8601 timestamp of the health check |

### Error Responses

**Status Code**

```
503 Service Unavailable
```

Returned when the database connection cannot be established.

```json
{
    "success": false,
    "message": "Service is temporarily unavailable.",
    "errors": []
}
```

---

# 15. Authentication Endpoints

Authentication endpoints are responsible for user authentication and session management.

---

## Login

Authenticates a user and creates a new session.

### Endpoint

```http
POST /api/v1/auth/login
```

### Authentication

Not Required

### Request Body

```json
{
    "email": "manager@quest.com",
    "password": "password123"
}
```

### Success Response

**Status Code**

```
200 OK
```

```json
{
    "success": true,
    "message": "Login successful.",
    "data": {
        "accessToken": "<jwt_access_token>",
        "user": {
            "id": "uuid",
            "name": "John Doe",
            "email": "manager@quest.com",
            "role": {
                "id": 2,
                "name": "Manager"
            },
            "permissions": [
                "VIEW_DASHBOARD",
                "VIEW_USERS",
                "VIEW_TICKETS",
                "CREATE_TICKET",
                "UPDATE_TICKET",
                "DELETE_TICKET",
                "ASSIGN_TICKET",
                "ADD_COMMENT"
            ]
        }
    }
}
```

The refresh token is set as an HttpOnly cookie (`refreshToken`) and is not included in the response body.

Member users receive the same permission set except `DELETE_TICKET`.

### Error Responses

| Status | Description |
|---------|-------------|
| 401 | The email or password you entered is incorrect. |
| 422 | Please correct the highlighted fields. |

---

## Refresh Access Token

Issues a new Access Token using the refresh token from the HttpOnly cookie. The refresh token is rotated on every successful refresh.

### Endpoint

```http
POST /api/v1/auth/refresh
```

### Authentication

Refresh Token Required (HttpOnly Cookie)

### Request Body

None. The refresh token is read from the `refreshToken` cookie.

### Success Response

**Status Code**

```
200 OK
```

```json
{
    "success": true,
    "message": "Access token refreshed successfully.",
    "data": {
        "accessToken": "<new_access_token>"
    }
}
```

A new refresh token is set as an HttpOnly cookie. The previous refresh token becomes invalid immediately.

### Error Responses

| Status | Description |
|---------|-------------|
| 401 | Your session has expired. Please sign in again. |

---

## Logout

Logs out the current session.

Only the current session is revoked.

Other active sessions remain logged in.

The refresh token cookie is cleared.

### Endpoint

```http
POST /api/v1/auth/logout
```

### Authentication

Required

Bearer Token

### Success Response

**Status Code**

```
200 OK
```

```json
{
    "success": true,
    "message": "Logged out successfully."
}
```

### Error Responses

| Status | Description |
|---------|-------------|
| 401 | Authentication required. |

---

## Get Current User

Returns the authenticated user's profile, role and permissions.

Used by the frontend during application initialization.

### Endpoint

```http
GET /api/v1/auth/me
```

### Authentication

Required

Bearer Token

### Success Response

```json
{
    "success": true,
    "message": "User retrieved successfully.",
    "data": {
        "id": "uuid",
        "name": "John Doe",
        "email": "manager@quest.com",
        "role": {
            "id": 2,
            "name": "Manager"
        },
        "permissions": [
            "VIEW_DASHBOARD",
            "VIEW_USERS",
            "VIEW_TICKETS",
            "CREATE_TICKET",
            "UPDATE_TICKET",
            "DELETE_TICKET",
            "ASSIGN_TICKET",
            "ADD_COMMENT"
        ]
    }
}
```

---

# 16. Dashboard Endpoints

Dashboard endpoints provide summarized application statistics.

---

## Get Dashboard

Returns all information required to render the dashboard in a single request.

### Endpoint

```http
GET /api/v1/dashboard
```

### Authentication

Required

Bearer Token

### Required Permission

```
VIEW_DASHBOARD
```

### Success Response

```json
{
    "success": true,
    "message": "Dashboard retrieved successfully.",
    "data": {
        "statistics": {
            "totalTickets": 128,
            "myTickets": 16,
            "open": 34,
            "inProgress": 28,
            "resolved": 42,
            "closed": 16,
            "cancelled": 8
        },
        "recentTickets": []
    }
}
```

---

# 17. User Endpoints

The initial release exposes read-only user information.

Users are seeded during application setup.

User management is outside the scope of Version 1.

---

## Get Users

Returns all active users.

Used for:

- Assignee dropdown
- Reporter information
- User selection

### Endpoint

```http
GET /api/v1/users
```

### Authentication

Required

Bearer Token

### Required Permission

```
VIEW_USERS
```

In Version 1, both Member and Manager roles are granted `VIEW_USERS`. The permission enables authenticated access to the user list for assignment, display, and collaboration features. Future administrative user management endpoints (create, update, delete) will use separate permissions.

### Success Response

```json
{
    "success": true,
    "message": "Users retrieved successfully.",
    "data": [
        {
            "id": "uuid",
            "name": "John Doe",
            "email": "john@quest.com",
            "role": {
                "id": 2,
                "name": "Manager"
            }
        }
    ]
}
```

### Error Responses

| Status | Description |
|---------|-------------|
| 401 | Authentication required. |
| 403 | You don't have permission to view users. |

---

# 18. Ticket Endpoints

Ticket endpoints manage the complete lifecycle of support tickets.

---

## Get Tickets

Returns a paginated list of tickets.

Supports searching, filtering and sorting.

### Endpoint

```http
GET /api/v1/tickets
```

### Authentication

Required

Bearer Token

### Required Permission

```
VIEW_TICKETS
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Number | Page number |
| limit | Number | Number of records per page |
| search | String | Search by ticket number, title, or description |
| status | Enum | Filter by ticket status |
| priority | Enum | Filter by priority |
| assignee | UUID / me | Filter by assignee |
| sortBy | String | Sort field |
| sortOrder | asc / desc | Sort direction |

### Example

```http
GET /api/v1/tickets?page=1&limit=20&status=OPEN&priority=HIGH&search=login&sortBy=updatedAt&sortOrder=desc
```

### Success Response

```json
{
    "success": true,
    "message": "Tickets retrieved successfully.",
    "data": {
        "items": [],
        "pagination": {
            "page": 1,
            "limit": 20,
            "totalItems": 126,
            "totalPages": 7
        }
    }
}
```

---

## Get Ticket Details

Returns a single ticket including its comments and activity history.

### Endpoint

```http
GET /api/v1/tickets/:id
```

### Authentication

Required

Bearer Token

### Required Permission

```
VIEW_TICKETS
```

### Success Response

```json
{
    "success": true,
    "message": "Ticket retrieved successfully.",
    "data": {
        "id": "uuid",
        "ticketNumber": "QST-001",
        "title": "Unable to login",
        "description": "...",
        "status": "OPEN",
        "priority": "HIGH",
        "reporter": {},
        "assignee": {},
        "comments": [],
        "activities": [],
        "createdAt": "...",
        "updatedAt": "..."
    }
}
```

---

## Create Ticket

Creates a new support ticket.

### Endpoint

```http
POST /api/v1/tickets
```

### Authentication

Required

Bearer Token

### Required Permission

```
CREATE_TICKET
```

### Request Body

```json
{
    "title": "Unable to login",
    "description": "User cannot login after password reset.",
    "priority": "HIGH",
    "assigneeId": "uuid"
}
```

### Success Response

```http
201 Created
```

```json
{
    "success": true,
    "message": "Ticket created successfully.",
    "data": {
        "id": "uuid",
        "ticketNumber": "QST-025"
    }
}
```

---

## Update Ticket

Updates one or more ticket fields.

Only supplied fields are updated.

### Endpoint

```http
PATCH /api/v1/tickets/:id
```

### Authentication

Required

Bearer Token

### Required Permission

```
UPDATE_TICKET
```

### Request Body

```json
{
    "title": "Updated title",
    "description": "Updated description",
    "status": "IN_PROGRESS",
    "priority": "MEDIUM",
    "assigneeId": "uuid"
}
```

Every successful update automatically creates an Activity record.

### Success Response

```json
{
    "success": true,
    "message": "Ticket updated successfully.",
    "data": {}
}
```

---

## Delete Ticket

Permanently deletes a ticket.

Quest currently uses hard deletion.

### Endpoint

```http
DELETE /api/v1/tickets/:id
```

### Authentication

Required

Bearer Token

### Required Permission

```
DELETE_TICKET
```

### Success Response

```http
204 No Content
```

---

# 19. Comment Endpoints

Comments belong to Tickets and cannot exist independently.

Comments are immutable once created.

Editing and deleting comments are not supported in Version 1.

---

## Get Comments

Returns all comments for a ticket.

Newest comments appear first.

### Endpoint

```http
GET /api/v1/tickets/:id/comments
```

### Authentication

Required

Bearer Token

### Required Permission

```
VIEW_TICKETS
```

### Success Response

```json
{
    "success": true,
    "message": "Comments retrieved successfully.",
    "data": [
        {
            "id": "uuid",
            "author": {},
            "message": "Working on this issue.",
            "createdAt": "..."
        }
    ]
}
```

---

## Add Comment

Adds a new comment to a ticket.

A corresponding Activity record is automatically created.

### Endpoint

```http
POST /api/v1/tickets/:id/comments
```

### Authentication

Required

Bearer Token

### Required Permission

```
ADD_COMMENT
```

### Request Body

```json
{
    "message": "Issue has been reproduced."
}
```

### Success Response

```http
201 Created
```

```json
{
    "success": true,
    "message": "Comment added successfully.",
    "data": {}
}
```

### Error Responses

| Status | Description |
|---------|-------------|
| 400 | Invalid request. |
| 401 | Authentication required. |
| 403 | You don't have permission to add comments. |
| 404 | Ticket not found. |

---

# 20. Permission Matrix

The following permissions are used throughout Version 1 of Quest.

| Permission | Description |
|------------|-------------|
| VIEW_DASHBOARD | View dashboard statistics |
| VIEW_USERS | View application users (granted to all Version 1 roles) |
| VIEW_TICKETS | View tickets |
| CREATE_TICKET | Create new tickets |
| UPDATE_TICKET | Update ticket details |
| DELETE_TICKET | Delete tickets |
| ASSIGN_TICKET | Assign tickets to users |
| ADD_COMMENT | Add comments to tickets |

The backend validates permissions before processing protected requests.

If the authenticated user lacks the required permission, the API responds with:

```
403 Forbidden
```

---

# 21. API Versioning

Quest follows URL-based API versioning.

Current version

```
/api/v1
```

Future breaking changes should introduce a new API version rather than modifying existing endpoints.

Example

```
/api/v2/tickets
```

---

# 22. Endpoint Summary

## Health

| Method | Endpoint |
|----------|----------|
| GET | /api/v1/health |

---

## Authentication

| Method | Endpoint |
|----------|----------|
| POST | /api/v1/auth/login |
| POST | /api/v1/auth/logout |
| POST | /api/v1/auth/refresh |
| GET | /api/v1/auth/me |

---

## Dashboard

| Method | Endpoint |
|----------|----------|
| GET | /api/v1/dashboard |

---

## Users

| Method | Endpoint |
|----------|----------|
| GET | /api/v1/users |

---

## Tickets

| Method | Endpoint |
|----------|----------|
| GET | /api/v1/tickets |
| GET | /api/v1/tickets/:id |
| POST | /api/v1/tickets |
| PATCH | /api/v1/tickets/:id |
| DELETE | /api/v1/tickets/:id |

---

## Comments

| Method | Endpoint |
|----------|----------|
| GET | /api/v1/tickets/:id/comments |
| POST | /api/v1/tickets/:id/comments |

---

# 23. Future Endpoints

The following endpoints are intentionally excluded from Version 1 and will be introduced as future enhancements.

## User Management

```
POST   /users

PATCH  /users/:id

DELETE /users/:id
```

---

## Role Management

```
GET    /roles

POST   /roles

PATCH  /roles/:id

DELETE /roles/:id
```

---

## Permission Management

```
GET /permissions
```

---

## Session Management

```
GET    /sessions

DELETE /sessions/:id
```

Allows users to revoke individual login sessions.

---

## Attachments

```
POST /tickets/:id/attachments
```

---

## Notifications

```
GET /notifications
```

---

# 24. OpenAPI / Swagger

Once the backend implementation is complete, the REST API will be documented using OpenAPI (Swagger).

The generated documentation should include:

- Endpoint descriptions
- Request schemas
- Response schemas
- Authentication requirements
- Authorization requirements
- Query parameters
- Example requests
- Example responses

Swagger should be generated directly from the backend implementation to ensure it remains synchronized with the API.

---

# 25. Implementation Notes

The following conventions should be followed throughout the backend implementation.

- All endpoints return JSON.
- All timestamps use ISO 8601 format.
- UUIDs are used for business entities.
- Access Tokens are never stored in the database.
- Access Tokens are stored in frontend memory only.
- Refresh Tokens are hashed using `SHA-256(refreshToken + serverPepper)` before storage.
- Refresh Tokens are delivered as HttpOnly cookies and are never returned in JSON responses.
- Refresh Tokens are rotated on every successful refresh request.
- Every authenticated request validates the JWT and the associated session state.
- User permissions are loaded from the database on every authenticated request.
- Every successful ticket update automatically creates an Activity record.
- Every new comment automatically creates an Activity record.
- PATCH endpoints perform partial updates.
- User-facing error messages should be clear, concise and safe to display directly in the UI.
- Protected endpoints require a valid Access Token.
- Authorization is enforced through Role-Based Access Control (RBAC).

---

# 26. Summary

This document defines the complete API contract for Version 1 of Quest.

It serves as the single source of truth for communication between the frontend and backend.

Any modifications to endpoint behavior, request formats, response structures or authentication flow should be reflected in this document before implementation.

After the backend implementation is complete, this specification will be supplemented with automatically generated Swagger documentation to provide an interactive reference for developers.