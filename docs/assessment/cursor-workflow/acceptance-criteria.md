# Acceptance Criteria (Cursor Workflow)

Cursor-oriented acceptance checklist. Full mapping: [`../acceptance-criteria.md`](../acceptance-criteria.md). Official requirements: `docs/01`–`07`.

---

## Global (every milestone)

- [ ] Matches relevant sections of PRD and API spec
- [ ] No undocumented features
- [ ] `npm run lint` passes (client + server)
- [ ] `npm run typecheck` passes (client + server)
- [ ] `npm run build` passes (client + server)
- [ ] Manual verification per [`07-testing-strategy.md`](../../07-testing-strategy.md)
- [ ] Docs updated if implementation diverged from spec (with approval)

---

## M1 Foundation

- [ ] `GET /api/v1/health` → `{ success, message, data: { status, database, timestamp } }`
- [ ] `database` is boolean
- [ ] Theme + responsive sidebar per UI spec
- [ ] Glassmorphism matches reference images

---

## M2 Auth

- [ ] Login / logout / refresh / me work
- [ ] Access token not in localStorage/sessionStorage
- [ ] `withCredentials: true` on API client
- [ ] No login flash on reload (splash during init)
- [ ] Protected routes redirect unauthenticated users

---

## M3 Tickets

- [ ] CRUD + comments + activity
- [ ] Search: ticketNumber, title, description
- [ ] Filters: status, priority, assignee, reporter
- [ ] Status transitions enforced server-side
- [ ] Member cannot delete
- [ ] URL reflects filter state
- [ ] Responsive panel (desktop split / mobile full screen)

---

## M4 Dashboard

- [ ] `/dashboard` loads aggregated data
- [ ] KPIs, activity, lists, charts render
- [ ] Ticket rows open workspace
- [ ] Loading / empty / error states

---

## Stretch (submission)

- [ ] Reporter filter end-to-end
- [ ] Swagger at `/api/docs` when enabled
- [ ] `npm run test` passes in `server/` and `client/`
- [ ] `docker compose up --build` succeeds
- [ ] CI workflow passes on GitHub

---

## AI Workflow (assessment)

- [ ] `docs/assessment/prompt-history.md` complete
- [ ] Assessment artifacts in `docs/assessment/` present
- [ ] Engineering decisions traceable to prompt history
- [ ] No invented process claims

---

## Stop Conditions

Stop and ask user if:

- Doc conflict with implementation
- Schema or API contract change needed
- Architectural change beyond current milestone
- Feature not in PRD / project plan

Per [`.cursor/rules/project.mdc`](../../../.cursor/rules/project.mdc).
