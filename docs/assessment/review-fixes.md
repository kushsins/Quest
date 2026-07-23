# Review Fixes

Changes made in response to review cycles and validation passes. Complements [`code-review-notes.md`](./code-review-notes.md) and [`debugging-notes.md`](./debugging-notes.md).

---

## Milestone 1 — Final Review (Exchange 12)

| Fix | Files | Reason |
|-----|-------|--------|
| Theme flash on load | `client/index.html` | Inline script applies theme before paint |
| Logger abstraction | `server/src/shared/utils/logger.ts`, `app.ts`, `index.ts`, `error.middleware.ts`, `health.service.ts`, `env.ts` | Architecture / M1 requirement |
| DRY mobile menu | `MobileHeader.tsx` uses `MobileMenuButton.tsx` | Duplication |
| Sidebar preference helper | `useSidebar.tsx` — simplified `readCollapsedPreference` | Maintainability |

**Architectural changes:** None — user allowed implementation fixes only.

---

## Milestone 1 — Documentation Alignment (Exchanges 1, 3)

| Fix | Document / code | Reason |
|-----|-----------------|--------|
| DBML asset paths | `docs/04-database-design.md` | Path matched disk layout |
| Health endpoint spec | `docs/05-api-specification.md` | Missing from API spec before M1 |
| Health `database` type | API spec + implementation | User-approved boolean `true`/`false` |
| Login image alt text | `docs/02-ui-ux-specification.md` | Swapped references corrected |
| Stale readme reference | `readme.md` | Removed non-existent `design-reference.md` |

---

## Milestone 1 — Cleanup (Exchange 13)

| Area | Change |
|------|--------|
| `readme.md` | Full onboarding: stack, env, Docker, dev commands, doc links |
| `.env.example` | Verified both client and server templates |
| Dependencies | Removed unused packages where identified |
| Dead code | Removed unused imports/components in foundation scope |

---

## Milestone 3 Phase 1 — Validation Fixes (Exchange 19)

| Fix | File | Reason |
|-----|------|--------|
| Remove `VIEW_USERS` from Member | `server/src/shared/constants/permissions.ts` | RBAC violation in validation |
| Permission-specific 403 messages | `server/src/middleware/authorize.middleware.ts` | API spec messages for `VIEW_USERS`, `ADD_COMMENT` |
| Search param documentation | `docs/05-api-specification.md` | Includes `ticketNumber` |

---

## Milestone 3 — Backend Refinement (Exchange 20)

**User-directed reversal / enhancement:**

| Change | Reason |
|--------|--------|
| Restore `VIEW_USERS` for Member role | Assignee/reporter dropdowns need user list |
| Seed + API docs updated | Consistent with new permission model |

This was an **explicit product decision** after validation, not an oversight.

---

## Milestone 3 — Pre-Commit UI Fixes (Exchange 22)

| Fix | File | Reason |
|-----|------|--------|
| Remove checkbox / bulk selection UI | `TicketList.tsx` | UI spec excludes bulk actions |
| Remove column settings button | `TicketList.tsx` | Non-functional |
| Conditional delete column | `TicketList.tsx` | `canDeleteTicket` permission |
| Lint: optional chain | `TicketWorkspace.tsx` | ESLint |
| Remove unused type assertion | `ticket.constants.ts` | Hygiene |
| Remove unused table CSS | `globals.css` | Dead styles |

---

## Runtime Bug Fixes (User-Reported)

| Issue | Fix | Files |
|-------|-----|-------|
| Mobile sidebar toggle | Glass CSS vs `fixed` conflict | `Sidebar.tsx`, `globals.css`, `MobileHeader.tsx` |
| Clear advanced filters | Single URL update | `useTicketFilters.ts`, `TicketWorkspace.tsx` |
| Mobile ticket panel height | Flex height chain + `fixed inset-0` | `AppLayout.tsx`, `TicketsLayout.tsx`, `TicketPanel.tsx` |

---

## Infrastructure Fixes

| Issue | Fix | Exchange |
|-------|-----|----------|
| Docker entrypoint CRLF | Strip `\r`, `.gitattributes` | 40 |
| Prisma on Alpine | `binaryTargets`, `openssl` in image | 40 |
| Node version drift | `.nvmrc` + `engines` + CI `node-version-file` | 43 |

---

## Fixes Explicitly Not Made (Deferred)

Documented as accepted limitations:

| Item | Reason |
|------|--------|
| Ticket number race locking | Accepted V1 limitation per user approval |
| Full PRD/UI "Final" status headers | Stretch documentation pass |
| Dashboard automated tests | Out of stretch test scope |
| Performance: 7 parallel count queries | Identified in stretch audit; not blocking MVP |

---

## Verification After Fixes

Each fix pass included:

```bash
npm run lint && npm run typecheck && npm run build
```

Ticket validation pass additionally ran seed + 45 API checks. Test suites: see [`test-results.md`](./test-results.md).
