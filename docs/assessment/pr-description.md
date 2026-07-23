# Pull Request Description

## Title

`feat: Quest MVP — Foundation, Auth, Tickets, Dashboard + stretch goals`

---

## Summary

Delivers **Quest** Version 1: a support ticket management platform with glassmorphism UI, Express/Prisma API, and PostgreSQL.

This PR completes **Milestones 1–4** per [`docs/06-project-plan.md`](../06-project-plan.md) and adds **stretch goals** for assessment submission (automated tests, Docker full stack, CI, Swagger, reporter filter).

**Author:** Kushagra Singh  
**AI-assisted development:** Cursor — full workflow in [`docs/assessment/prompt-history.md`](./prompt-history.md)

---

## What's Included

### Milestone 1 — Foundation

- Monorepo: `client/` (React 19 + Vite), `server/` (Express + Prisma), `docker/`
- Health endpoint `GET /api/v1/health` with standardized responses
- Theme system (Light / Dark / System), responsive sidebar, glassmorphism design tokens
- TanStack Query + Axios API client shell

### Milestone 2 — Authentication

- JWT access token (memory) + HttpOnly refresh cookie
- Login, logout, silent refresh, protected routes
- Frontend auth state machine, interceptors with 401 queue

### Milestone 3 — Ticket Management

- Full ticket CRUD, comments, activity, search/filter/sort/pagination
- RBAC (Manager / Member) with permission middleware
- Ticket workspace: list, panel, inline edit, URL-driven filters
- `GET /api/v1/users` for assignee/reporter pickers

### Milestone 4 — Dashboard

- `GET /api/v1/dashboard` aggregated endpoint
- KPI cards, activity feed, ticket lists, status/priority charts
- Landing route `/dashboard`

### Stretch Goals

- **Reporter filter** — API + advanced filter UI
- **Swagger** — `/api/docs` (gated by `SWAGGER_ENABLED`)
- **Tests** — Backend 66 tests (unit + integration); frontend 89 tests
- **Docker** — `docker compose up --build` full stack
- **CI** — GitHub Actions (lint, typecheck, test, build)

---

## Documentation

Official specs (unchanged as source of truth):

- `docs/01-product-requirements.md` through `docs/07-testing-strategy.md`

Assessment artifacts:

- `docs/assessment/*` — process, tests, debugging, reviews, AI workflow

---

## Test Plan

- [ ] `cd server && npm run lint && npm run typecheck && npm run test && npm run build`
- [ ] `cd client && npm run lint && npm run typecheck && npm run test && npm run build`
- [ ] `docker compose up --build` — health, login, tickets UI
- [ ] Manual: Manager (`manager@quest.com`) and Member (`member@quest.com`) / `password123`
- [ ] CI green on push

See [`docs/assessment/test-results.md`](./test-results.md) for documented verification.

---

## Breaking Changes

None — greenfield submission.

---

## Known Limitations

- Sequential ticket numbers without DB locking (documented V1 acceptance)
- Swagger off by default in production (`SWAGGER_ENABLED=false`)
- Some doc headers still show Draft while implementation is complete (noted in stretch audit)

---

## Reviewer Notes

- Follow API contract in [`docs/05-api-specification.md`](../05-api-specification.md)
- UI reference images: `docs/assets/ui/`
- AI development evidence: [`docs/assessment/prompt-history.md`](./prompt-history.md)
