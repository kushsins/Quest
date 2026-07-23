# Code Review Notes

Structured review cycles performed during development. Evidence in [`prompt-history.md`](./prompt-history.md).

---

## Review Model

Reviews were **user-initiated**, not ad hoc. Typical prompt structure:

1. Scope (milestone or module).
2. Checklist (architecture, types, duplication, docs, performance).
3. **No new features** unless explicitly allowed.
4. Fix implementation issues only; stop for architectural decisions.

---

## Milestone 1 — Final Project Review (Exchange 12)

**Scope:** Full-stack foundation before M2.

### Findings

| Area | Assessment |
|------|------------|
| Backend architecture | Modular layout; thin controllers; `ApiResponse` / `ApiError` consistent |
| Frontend architecture | Feature folders; TanStack Query pattern established |
| Folder structure | Matches [`03-system-architecture.md`](../03-system-architecture.md) |
| API contract | Health endpoint matches [`05-api-specification.md`](../05-api-specification.md) |
| Responsive / theme | Breakpoints align with UI spec |
| Performance | Bundle size warning noted; ambient blobs acceptable for M1 |

### Gaps identified (non-blocking)

- Hardcoded sidebar user until M2 auth
- No root README setup section (addressed in M1 cleanup)
- No CI / automated tests (planned stretch)
- `.github/` referenced in architecture but not yet present

### Verification

TypeScript, ESLint, production build — **pass** both apps. Live health check confirmed.

---

## Milestone 1 — Cleanup Review (Exchange 13)

**Scope:** Pre-commit hygiene.

- Removed unused assets/config where found
- Updated `readme.md` with setup, Docker, scripts
- Confirmed no stray `console.log` / TODO in committed scope
- **Code review — no issues found** (stated in AI response)

---

## Milestone 2 — Pre-M3 Cleanup (Exchange 15)

**Scope:** Production-readiness before ticket module.

| Check | Outcome |
|-------|---------|
| Dead code | Audited frontend + backend |
| Auth integration | Reviewed token lifecycle and interceptors |
| Dependencies | Leaned `package.json` where unused |
| Documentation | README and milestone status updates |

Build verification: lint, typecheck, build — pass.

---

## Milestone 3 Phase 1 — API Validation Review (Exchange 19)

**Scope:** Backend ticket module after implementation.

| Area | Result |
|------|--------|
| API endpoints | 45/45 manual checks |
| RBAC | Manager vs Member matrix verified |
| Business rules | Status transitions, search fields |
| Validation / errors | Standard `ApiError` shapes |

**Bugs found:** Member `VIEW_USERS` leak; generic 403 messages. See [`review-fixes.md`](./review-fixes.md).

---

## Milestone 3 — Pre-Commit Review (Exchange 22)

**Scope:** Ticket module stability before M4.

### Review dimensions (per user prompt)

- Dead code, architecture, React, TanStack Query, backend services, TypeScript, UI consistency, performance, documentation, cleanup

### Notable findings

| Finding | Action |
|---------|--------|
| Checkbox / bulk-selection UI in ticket table | **Removed** — contradicts UI spec § bulk actions excluded |
| Column settings button (non-functional) | **Removed** |
| Unused `.ticket-table-checkbox` CSS | **Removed** |
| Optional chain lint in `TicketWorkspace` | **Fixed** |

### Outcome

> Milestone 3 stable and ready to commit (Exchange 22 response).

---

## Milestone 3 — Commit Review (Exchange 23)

**Scope:** Final M3 cleanup pass (duplicate checklist to Exchange 22).

Confirmed lint, typecheck, build, seed. Spec alignment only — no redesign.

---

## Stretch Goals Audit (Exchange 27)

**Scope:** Gap analysis vs project plan M5 and testing strategy.

- Identified completed vs partial vs not-started stretch items
- Prioritized backend/frontend tests, reporter filter, Swagger, Docker, CI
- Documented doc drift (PRD/UI Draft status vs shipped MVP)

No code changes — planning only.

---

## Review Principles Applied

From user rules across prompts:

- Do not redesign during review passes
- Do not refactor for personal preference
- Architectural changes require explicit user approval
- Prefer spec alignment over new features

---

## Related Documents

- Fixes applied: [`review-fixes.md`](./review-fixes.md)
- Bugs from runtime: [`debugging-notes.md`](./debugging-notes.md)
- Acceptance mapping: [`acceptance-criteria.md`](./acceptance-criteria.md)
