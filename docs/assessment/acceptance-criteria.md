# Acceptance Criteria

Quest submission acceptance is measured against the **official project documentation** and the **verified implementation**. This document maps criteria to sources; it does not replace the PRD or project plan.

## Source Documents

| Priority | Document | Role |
|----------|----------|------|
| 1 | [`docs/01-product-requirements.md`](../01-product-requirements.md) | Product scope and roles |
| 2 | [`docs/02-ui-ux-specification.md`](../02-ui-ux-specification.md) | UI behaviour and design |
| 3 | [`docs/03-system-architecture.md`](../03-system-architecture.md) | Structure and patterns |
| 4 | [`docs/04-database-design.md`](../04-database-design.md) | Schema |
| 5 | [`docs/05-api-specification.md`](../05-api-specification.md) | API contract |
| 6 | [`docs/06-project-plan.md`](../06-project-plan.md) | Milestones and definition of done |
| 7 | [`docs/07-testing-strategy.md`](../07-testing-strategy.md) | Manual and automated testing |

Process evidence: [`prompt-history.md`](./prompt-history.md).

---

## Milestone Definition of Done

From [`docs/06-project-plan.md` §8](../06-project-plan.md):

| Criterion | Evidence |
|-----------|----------|
| Backend implementation complete | Modules under `server/src/modules/` for auth, health, tickets, dashboard, users |
| Frontend implementation complete | Feature modules under `client/src/features/` |
| Integration successful | Auth cookie flow, ticket workspace, dashboard data loading |
| Manual testing completed | Documented in [`07-testing-strategy.md`](../07-testing-strategy.md); API validation 45/45 in Exchange 19 |
| No known blocking issues | Pre-commit reviews (Exchanges 12, 15, 22–23) |
| Documentation updated where necessary | API spec, README, project plan status fields |

---

## Milestone 1 — Foundation

| Criterion | Status | Reference |
|-----------|--------|-----------|
| Project starts (client + server + PostgreSQL) | Met | Exchange 3, 12; [`readme.md`](../../readme.md) |
| `GET /api/v1/health` returns documented shape | Met | `database: true` boolean per approved contract |
| Frontend communicates with backend | Met | Health / system status integration |
| Theme (Light / Dark / System) | Met | `ThemeProvider`, UI spec |
| Responsive sidebar (desktop / tablet / mobile) | Met | `useSidebar`, Exchanges 7–11 |
| Glassmorphism per UI reference | Met | Multiple visual refinement passes (Exchanges 6–10) |
| ESLint, TypeScript, build pass | Met | Exchanges 3, 12–13 |

---

## Milestone 2 — Authentication

| Criterion | Status | Reference |
|-----------|--------|-----------|
| Login, refresh, logout, `/auth/me` | Met | [`05-api-specification.md`](../05-api-specification.md); Exchange 15 |
| Access token in memory only | Met | User requirement Exchange 15 |
| Refresh via HttpOnly cookie | Met | Architecture + implementation |
| Silent auth on load (splash, no login flash) | Met | `AuthGate`, `AuthSplash` |
| Axios interceptor queue on 401 | Met | Exchange 15 architecture section |
| Protected routes | Met | `ProtectedRoute`, router |
| Login UI per design system | Met | Exchange 15 |

---

## Milestone 3 — Ticket Management

| Criterion | Status | Reference |
|-----------|--------|-----------|
| Ticket CRUD API | Met | Exchange 18; manual API 45/45 |
| Search, filter, sort, pagination | Met | Backend + `useTicketFilters` URL state |
| Comments and activity | Met | Ticket detail endpoints |
| Status transition validation | Met | `ticket.constants.ts` / service |
| RBAC (Manager vs Member) | Met | Exchange 19; permissions integration tests |
| Ticket workspace UI | Met | Exchanges 21–22 |
| Inline editing, comments | Met | Phase 3 scope in M3 |
| `GET /api/v1/users` for assignee/reporter | Met | Exchange 20 (`VIEW_USERS` for all authenticated users) |

---

## Milestone 4 — Dashboard

| Criterion | Status | Reference |
|-----------|--------|-----------|
| Dashboard landing page | Met | Default route `/dashboard` |
| KPI cards (total, status counts, my assigned) | Met | Exchange 26 |
| Recent activity, my tickets, recently updated | Met | Dashboard widgets |
| Status / priority distribution | Met | Chart components |
| Single aggregated API endpoint | Met | `GET /api/v1/dashboard` |
| Ticket row navigation to workspace | Met | Exchange 26 verification |

---

## Stretch Goals (Submission)

| Feature | Status | Evidence |
|---------|--------|----------|
| Reporter advanced filter | Met | Exchange 30; API + UI |
| Swagger / OpenAPI (`/api/docs`) | Met | Exchange 32; `SWAGGER_ENABLED` flag |
| Backend unit tests | Met | 50 cases / 7 files (Exchange 34) |
| Backend integration tests | Met | 16 cases / 3 files (Exchange 35) |
| Frontend tests | Met | 89 cases / 11 files (Exchange 37) |
| Docker full stack | Met | `docker compose up --build` (Exchange 40) |
| GitHub Actions CI | Met | `.github/workflows/ci.yml` (Exchanges 41–43) |

---

## Known Accepted Limitations (V1)

Documented during development — not submission blockers:

| Limitation | Source |
|------------|--------|
| Sequential ticket numbers without row locking | `ticket.constants.ts`; Exchange 19 |
| PRD / UI spec still marked Draft in some headers | Stretch audit Exchange 27 |
| Global test coverage % low by design (targeted suites) | Exchanges 34–37 |
| Swagger disabled by default in production | `SWAGGER_ENABLED=false` |

---

## Verification Commands

From repository root (see [`readme.md`](../../readme.md)):

```bash
# Backend
cd server && npm run lint && npm run typecheck && npm run test:unit && npm run test:integration && npm run build

# Frontend
cd client && npm run lint && npm run typecheck && npm run test && npm run build

# Full stack
docker compose up --build
```

Detailed results: [`test-results.md`](./test-results.md).
