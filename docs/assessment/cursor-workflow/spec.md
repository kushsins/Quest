# Spec (Cursor Workflow)

Condensed specification pointer for Cursor agents. **Full specs are authoritative** in `docs/01`–`07`; this file only orients — it does not replace them.

---

## Product

Quest is a support ticket platform for internal teams: create, assign, track, and resolve tickets with comments and activity history.

**Full PRD:** [`docs/01-product-requirements.md`](../../01-product-requirements.md)

---

## Roles

| Role | Capabilities (summary) |
|------|------------------------|
| **Member** | Create/view/edit tickets, comment, assign (not delete) |
| **Manager** | Member + delete tickets, full ticket administration |

**Permissions:** `server/src/shared/constants/permissions.ts`  
**API:** [`docs/05-api-specification.md`](../../05-api-specification.md)

---

## UI / UX

- Glassmorphism design language
- Light, Dark, System themes
- Responsive: mobile overlay sidebar, tablet collapsed, desktop expandable
- Ticket workspace: list + resizable/read-only panel; URL-driven filters
- Dashboard: KPIs, activity, distributions, ticket shortcuts

**Full spec:** [`docs/02-ui-ux-specification.md`](../../02-ui-ux-specification.md)  
**References:** `docs/assets/ui/*.png`

---

## Architecture

- **Client:** `app/` → `features/` → `shared/`
- **Server:** `modules/<feature>/` (routes, controller, service, validation)
- **Data:** Prisma + PostgreSQL per [`docs/04-database-design.md`](../../04-database-design.md)
- **Auth:** JWT access (memory) + refresh cookie (HttpOnly)

**Full spec:** [`docs/03-system-architecture.md`](../../03-system-architecture.md)

---

## API Highlights

| Area | Base / notes |
|------|----------------|
| Health | `GET /api/v1/health` (public) |
| Auth | `POST /auth/login`, refresh, logout, `GET /auth/me` |
| Tickets | CRUD, comments, list with query params |
| Users | `GET /api/v1/users` (authenticated + `VIEW_USERS`) |
| Dashboard | `GET /api/v1/dashboard` |
| Docs | `GET /api/docs` when `SWAGGER_ENABLED=true` |

**Full spec:** [`docs/05-api-specification.md`](../../05-api-specification.md)

---

## Ticket List Query Params (V1)

Includes: `page`, `limit`, `search`, `status`, `priority`, `assignee`, `reporter`, `sortBy`, `sortOrder`.  
`assignee=me` and `reporter=me` resolve server-side.

---

## Out of Scope (V1)

- Bulk actions, Kanban, attachments, notifications UI
- User admin CRUD
- Soft delete (hard delete per PRD)

---

## Definition of Done

Per [`docs/06-project-plan.md` §8](../../06-project-plan.md): backend + frontend + integration + manual test + docs update + no blockers.

---

## Testing

Manual checklists: [`docs/07-testing-strategy.md`](../../07-testing-strategy.md)  
Automated: `server` Vitest + Supertest; `client` Vitest + RTL.

---

## Change Policy

If documentation conflicts with code, **stop and ask** — do not assume.  
See [`.cursor/rules/project.mdc`](../../../.cursor/rules/project.mdc).
