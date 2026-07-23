# Cursor Rules & Instructions

Instructions for Cursor agents on Quest. **Canonical rules:** [`.cursor/rules/project.mdc`](../../../.cursor/rules/project.mdc). This document summarizes and extends for assessment workflow.

---

## Mandatory: Read First

Before any implementation:

1. `docs/01-product-requirements.md`
2. `docs/02-ui-ux-specification.md`
3. `docs/03-system-architecture.md`
4. `docs/04-database-design.md`
5. `docs/05-api-specification.md`
6. `docs/06-project-plan.md`
7. `docs/07-testing-strategy.md`

On conflict → **stop and ask user**.

---

## Implementation Rules

| Rule | Detail |
|------|--------|
| Milestone scope | One milestone at a time; verify before next |
| Plan before code | File list, order, risks — wait for approval |
| Controllers | Thin; delegate to services |
| Validation | Zod on inputs |
| Errors | `ApiError` + global middleware; standard JSON shape |
| DB | Prisma only; schema from DBML |
| Frontend | Feature folders; reuse `shared/` components |
| Duplication | Prefer composition; no duplicate utilities |
| TypeScript | Strict mode |
| Docs | Update existing `docs/` — no parallel specs |

---

## Do Not Change Without Explicit Instruction

- API contracts (`docs/05-api-specification.md`)
- Database schema (`docs/04-database-design.md`)
- Folder structure (`docs/03-system-architecture.md`)
- Authentication flow (token storage model)
- Standard response format

---

## UI Rules

- Match `docs/assets/ui/` reference images
- Glassmorphism tokens in `globals.css` — avoid one-off inline glass
- Light / Dark / System themes
- Responsive breakpoints: mobile `<768`, tablet `768–1024`, desktop `>1024`

---

## Backend Rules

- Module pattern: `*.routes.ts` → `*.controller.ts` → `*.service.ts`
- RBAC: `requirePermission()` on routes
- Pagination: shared `pagination.schema.ts` / `pagination.util.ts`
- No secrets in responses or logs

---

## Testing Rules

- Manual verification required per milestone
- Automated tests: Vitest (backend + frontend)
- Integration tests: real Postgres `quest_test`, Supertest
- No production refactors solely for tests unless approved

---

## Workflow Steps (each feature)

```text
1. Read documentation
2. Implement backend
3. Verify backend
4. Implement frontend
5. Integrate feature
6. Verify feature
7. Next milestone
```

---

## Cleanup Pass Rules

When user requests cleanup / review:

- **No new features**
- **No redesign**
- Remove dead code, fix lint, sync docs
- Run lint + typecheck + build
- Report remaining debt honestly

---

## Communication

- Project rules require **Caveman skill** (terse, accurate)
- User may use `/caveman` for approvals
- Surface architectural questions early

---

## Assessment Artifacts

Do not modify `docs/assessment/prompt-history.md` retroactively.  
New assessment docs reference official `docs/01`–`07` — do not duplicate them.

---

## Quick Commands

```bash
# Dev DB
docker compose -f docker/docker-compose.yml up -d

# Server
cd server && npm run dev

# Client
cd client && npm run dev

# Full verify
cd server && npm run lint && npm run typecheck && npm run test && npm run build
cd client && npm run lint && npm run typecheck && npm run test && npm run build
```

---

## Related

- [`project-context.md`](./project-context.md)
- [`spec.md`](./spec.md)
- [`tasks.md`](./tasks.md)
- [`acceptance-criteria.md`](./acceptance-criteria.md)
- Process log: [`../prompt-history.md`](../prompt-history.md)
