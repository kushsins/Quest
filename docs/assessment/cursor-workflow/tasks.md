# Tasks (Cursor Workflow)

Milestone-oriented task checklist derived from [`docs/06-project-plan.md`](../../06-project-plan.md) and completion evidence in [`../prompt-history.md`](../prompt-history.md).

Use when resuming work or verifying submission completeness.

---

## Milestone 1 — Foundation

- [x] Repository scaffold (`client/`, `server/`, `docker/`)
- [x] Prisma schema from DBML + initial migration
- [x] Health module (`GET /api/v1/health`)
- [x] `ApiResponse`, `ApiError`, error middleware
- [x] React + Vite + router + theme
- [x] Glassmorphism tokens + responsive sidebar
- [x] API client + health integration
- [x] Lint / typecheck / build verification
- [x] M1 review + cleanup (Exchanges 12–13)

---

## Milestone 2 — Authentication

- [x] Backend auth module (login, refresh, logout, me)
- [x] JWT + refresh cookie + RBAC seed
- [x] Frontend auth state machine
- [x] Login page (design system)
- [x] Protected routes + silent refresh + interceptors
- [x] Pre-M3 cleanup (Exchange 15)

---

## Milestone 3 — Ticket Management

### Phase 1 — Backend

- [x] Tickets module (CRUD, list, filters, sort, pagination)
- [x] Comments + activity
- [x] Users module (`GET /users`)
- [x] Seed ~25 tickets
- [x] API validation 45/45 (Exchange 19)
- [x] `VIEW_USERS` for all authenticated users (Exchange 20)

### Phase 2 — Frontend workspace

- [x] Ticket list + toolbar + URL filters
- [x] Ticket panel (responsive)
- [x] Create ticket modal
- [x] Phase 3: inline edit, comments, delete (manager)

- [x] M3 pre-commit review (Exchanges 22–23)
- [x] Bug: clear advanced filters (Exchange 24)

---

## Milestone 4 — Dashboard

- [x] `GET /api/v1/dashboard`
- [x] Dashboard widgets (KPI, activity, lists, charts)
- [x] Default landing `/dashboard`
- [x] Bug: mobile panel full height (Exchange 26)

---

## Stretch Goals

- [x] Stretch audit + roadmap (Exchange 27)
- [x] Reporter filter (Exchanges 28–30)
- [x] Swagger `/api/docs` (Exchanges 31–32)
- [x] Backend unit tests — 50 cases (Exchange 34)
- [x] Backend integration tests — 16 cases (Exchange 35)
- [x] Frontend tests — 89 cases (Exchange 37)
- [x] Docker full stack (Exchanges 38–40)
- [x] GitHub Actions CI + `.nvmrc` (Exchanges 41–43)

---

## Optional / Deferred (documented)

- [ ] DB indexes + ticket counts aggregation endpoint (stretch audit)
- [ ] Full accessibility audit (skip link, axe)
- [ ] UI polish illustrations (empty states)
- [ ] E2E browser tests
- [ ] Dashboard automated tests
- [ ] Mark all docs `Final` in headers (PRD/UI still Draft in places)
- [ ] Ticket number race locking

---

## Per-Feature Workflow (repeat for new work)

1. Read docs (01–07 relevant sections)
2. Write implementation plan — **no code**
3. Get user approval
4. Implement backend → verify
5. Implement frontend → verify
6. Update docs if needed
7. Cleanup pass before commit

---

## Verification Commands

```bash
# Backend
cd server && npm run lint && npm run typecheck && npm run test && npm run build

# Frontend
cd client && npm run lint && npm run typecheck && npm run test && npm run build

# Docker
docker compose up --build
```

---

## References

- Acceptance: [`acceptance-criteria.md`](./acceptance-criteria.md)
- Tests: [`../test-results.md`](../test-results.md)
