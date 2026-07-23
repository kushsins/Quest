# Testing Strategy

# Quest

> Modern Support Ticket Management Platform

**Version:** 1.0.0  
**Status:** Final

---

# 1. Purpose

This document defines the testing strategy for Quest.

Its objective is to ensure that all implemented features function correctly, integrate seamlessly, and provide a reliable user experience before project completion.

---

# 2. Testing Objectives

The testing process aims to verify:

- Functional correctness
- API reliability
- Authentication and authorization
- User interface behavior
- Database integrity
- End-to-end feature integration

---

# 3. Testing Scope

The following areas are included in Version 1 testing.

- Authentication
- Authorization
- Dashboard
- Ticket Management
- Comments
- Activity Log
- Search
- Filtering
- Sorting
- Theme Switching
- Responsive Layout

---

# 4. Testing Approach

Quest follows a layered testing strategy.

## Manual Testing

Every feature is manually verified after implementation.

Manual testing confirms:

- User interactions
- UI behavior
- API responses
- Error handling
- Navigation
- Responsiveness

---

## API Testing

All REST endpoints should be tested using Postman or a similar API client.

API testing verifies:

- Request validation
- Response structure
- HTTP status codes
- Authentication
- Authorization
- Error responses

---

## Frontend Testing

Frontend functionality is verified through manual interaction and automated tests.

Automated tests use Vitest and React Testing Library (`client/tests/`). Run with `npm run test` from `client/`.

---

## Backend Testing

Backend functionality is verified through API testing, database validation, and automated tests.

Automated tests use Vitest and Supertest (`server/tests/`). Run `npm run test:unit` and `npm run test:integration` from `server/` (integration tests require Docker PostgreSQL on port `5433`).

---

## Milestone 1 — Foundation

Milestone 1 was verified manually before commit. No automated test suite is required at this stage.

Verified items:

- Docker PostgreSQL starts and reports healthy
- Backend starts and connects to the database
- `GET /api/v1/health` returns the documented success response
- Frontend dev server starts and loads the application shell
- Home route (`/`) redirects authenticated users to `/dashboard`; system status is at `/health`
- Theme switching works for Light, Dark, and System modes
- Responsive layouts behave correctly on mobile, tablet, and desktop
- Sidebar collapse state persists across sessions

---

# 5. Manual Test Checklist

## Milestone 2 — Authentication & Authorization (Backend)

Backend authentication was verified manually before frontend implementation. Verified items:

- Login returns access token and user; refresh token is set as HttpOnly cookie
- Invalid credentials return a user-friendly 401 error
- `GET /auth/me` requires a valid access token and active session
- `POST /auth/refresh` reads the refresh token from cookie and returns a new access token
- Refresh token rotation invalidates the previous refresh token immediately
- Logout revokes only the current session and clears the refresh token cookie
- Multiple device sessions remain active when one session is logged out
- `requirePermission` middleware implemented and ready for M3 route protection

Seed users for testing:

| Email | Password | Role |
|-------|----------|------|
| `manager@quest.com` | `password123` | Manager |
| `member@quest.com` | `password123` | Member |

Member permissions include all Version 1 capabilities except `DELETE_TICKET`. Both Member and Manager roles include `VIEW_USERS` for the user list endpoint.

---

## Milestone 3 — Ticket Management (Backend)

Backend ticket APIs were verified manually before frontend implementation. Verified items:

- `GET /tickets` supports pagination, search, filtering, sorting, and metadata
- `GET /tickets/:id` returns ticket details with comments and activities
- `POST /tickets` creates tickets with reporter/assignee defaults and activity logging
- `PATCH /tickets/:id` enforces status transitions and logs field changes
- `DELETE /tickets/:id` removes ticket, comments, and activities in a transaction
- `GET /tickets/:id/comments` and `POST /tickets/:id/comments` work as documented
- `GET /users` is available to all authenticated Version 1 roles (Member and Manager)
- Member cannot delete tickets; Manager has full access
- Invalid requests return user-friendly validation errors

---

## Milestone 3 — Ticket Management (Frontend)

Frontend ticket management is complete. Manual verification checklist:

- `/tickets` renders the workspace with toolbar as primary header (no page header)
- Issue-list layout displays ticket number, title, status, priority, assignee, reporter, and updated time
- Quick filters remain visible; advanced filters open in a popover with glass dropdown controls
- Search debounces and updates results dynamically
- Sorting updates the list without clearing filters
- Pagination shows "Showing X–Y of Z" with previous/next controls
- Selecting a ticket opens the detail panel; URL query params preserve `ticketId`, filters, sort, pagination, and `view`
- Panel width persists in `localStorage` and respects min/max bounds
- Panel expand/collapse uses `view=expanded`; open in new tab preserves fullscreen state
- Tablet panel renders as slide-over; mobile panel renders full-screen
- Create ticket modal opens from toolbar and via `Ctrl/Cmd + N`
- Successful creation refreshes the list and selects the new ticket
- Inline editing works for title, description, status, priority, assignee, and reporter
- Status dropdown only shows valid workflow transitions
- Comments can be posted; activity timeline updates and shows user names for assignee/reporter changes
- Managers can delete tickets from the panel or list row menu with confirmation
- Empty, loading, skeleton, and error states render for list and panel
- Filter count badges and quick-filter counts render without clipping

---

## Milestone 2 — Authentication & Authorization (Frontend)

Frontend authentication was verified manually after implementation. Verified items:

- Login page matches Quest glassmorphism design system
- Access token stored in memory only (not in browser storage)
- Silent authentication on application load via refresh cookie
- Auth splash shown during initialization (no login page flash)
- Protected routes (`/`, `/dashboard`, `/tickets`) require authentication
- Unauthenticated access redirects to `/login` with return path preserved
- Successful login returns user to originally requested route
- Automatic token refresh on `401` with single refresh request and queued retries
- Refresh failure clears state, query cache, and redirects to login
- Logout clears session, access token, query cache, and redirects to login
- Sidebar displays authenticated user name, role, and avatar initials
- Theme persistence works across login and authenticated sessions

---

## Authentication

- User can log in with valid credentials.
- Invalid credentials display a user-friendly error.
- Login sets refresh token as HttpOnly cookie (not in JSON response).
- Access token is returned in JSON and used via Bearer header.
- Protected routes require authentication and active session validation.
- Access token refresh works via cookie credentials.
- Refresh token rotation invalidates the previous token.
- Logout invalidates the current session and clears the cookie.
- Other device sessions remain active after single-session logout.

---

## Dashboard

- `GET /api/v1/dashboard` returns statistics, distributions, activity, and ticket summaries.
- Statistics display correctly (total, open, in progress, resolved, closed, cancelled, my assigned).
- Status and priority distribution charts render with CSS bars.
- Recent activity shows actor, action, ticket reference, and relative time.
- My assigned and recently updated ticket lists load successfully.
- Ticket rows navigate to `/tickets?ticketId=...`.
- Empty states display when appropriate.
- Loading skeletons display while fetching data.
- Dashboard is the default post-login landing page (`/` redirects to `/dashboard`).
- Dashboard cache refreshes after ticket create, update, delete, and comment mutations.

---

## Ticket Management

- Create Ticket
- View Ticket
- Edit Ticket
- Delete Ticket
- Assign Ticket
- Change Status
- Change Priority

Each action should update the UI immediately and persist changes to the database.

---

## Comments

- Add Comment
- Display Comments
- Display Newest Comments First
- Activity Log updates after comment creation

---

## Search & Filtering

Verify:

- Search by keyword
- Status filter
- Priority filter
- Assignee filter
- Combined filters
- Sorting

---

## User Interface

Verify:

- Light Theme
- Dark Theme
- System Theme
- Responsive Layout
- Glassmorphism Design
- Hover States
- Loading States
- Empty States
- Error States

---

# 6. API Verification

Every API endpoint should be verified for:

- Correct request validation
- Correct response structure
- Correct HTTP status codes
- Proper authentication
- Proper authorization
- User-friendly error messages

The response format should always follow the documented API contract.

Success Response

```json
{
    "success": true,
    "message": "...",
    "data": {}
}
```

Error Response

```json
{
    "success": false,
    "message": "...",
    "errors": []
}
```

---

# 7. Automated Testing

Automated testing is implemented as a stretch goal and runs in CI.

## Frontend (`client/`)

**Tools:** Vitest, React Testing Library, jsdom

**Coverage focus:**

- `useTicketFilters` URL state
- Ticket constants, validation schemas, query builder
- Shared utilities (`formatActivity`, `formatDate`, pagination types)
- Selective components (`ProtectedRoute`, `InlineEditableText`, `TicketQuickFilters`)

**Commands:** `npm run test`, `npm run test:coverage`

---

## Backend (`server/`)

**Tools:** Vitest, Supertest

**Unit tests:** validation schemas, ticket constants, pagination/duration utilities, authorize and error middleware.

**Integration tests:** authentication flows, ticket CRUD, RBAC (real `quest_test` database).

**Commands:** `npm run test`, `npm run test:unit`, `npm run test:integration`, `npm run test:coverage`

Automated tests complement manual verification; they do not replace the checklists in this document.

---

# 8. Definition of Test Completion

A feature is considered tested when:

- Manual verification passes.
- API responses match the documented contract.
- UI behaves as expected.
- Database operations complete successfully.
- No known blocking issues remain.

If automated tests are implemented, they should also pass successfully.

---

# 9. Summary

Quest prioritizes functional correctness and end-to-end feature validation throughout development.

Each milestone is manually verified before moving to the next, ensuring the application remains stable and fully functional at every stage.

Automated testing (Vitest on client and server, Supertest for API integration) is implemented and runs in CI alongside manual checklists in this document.