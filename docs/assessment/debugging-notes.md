# Debugging Notes

Issues encountered during Quest development and how they were resolved. Sourced from [`prompt-history.md`](./prompt-history.md); file paths refer to the current repository.

---

## 1. Mobile Sidebar Toggle Not Working

**Reported:** Exchange 11 — hamburger appeared dead in mobile mode.

**Root cause:** `.glass-floating` applied `position: relative`, overriding Tailwind `fixed` on the mobile drawer. Drawer never anchored to viewport.

**Fix:**

| File | Change |
|------|--------|
| `client/src/shared/components/layout/Sidebar.tsx` | Split mobile drawer: outer `<aside>` fixed + transform; inner div carries glass styles |
| `client/src/assets/styles/globals.css` | `position: relative` only on in-flow glass (`:not(.fixed)`) |
| `client/src/shared/components/layout/MobileHeader.tsx` | `openMobile` → `toggleMobile` for open/close |

**Validation:** Manual mobile view — drawer slides in, backdrop closes on tap.

---

## 2. Advanced Filters — Clear Did Not Reset Priority

**Reported:** Exchange 24 — "Clear advanced filters" removed assignee but left priority.

**Root cause:** Two consecutive `setSearchParams` calls; React batched updates so the second updater ran on stale URL state.

**Fix:**

| File | Change |
|------|--------|
| `client/src/features/tickets/hooks/useTicketFilters.ts` | `clearAdvancedFilters()` — single `updateParams` clears priority and assignee together |
| `client/src/features/tickets/components/TicketWorkspace.tsx` | Wire clear action to new helper |

---

## 3. Mobile Ticket Panel Height Followed Content

**Reported:** Exchange 26 — panel height changed with content instead of staying full screen.

**Root cause:** Flex layout chain did not lock height; `Outlet` grew with panel content.

**Fix:**

| File | Change |
|------|--------|
| `client/src/shared/components/layout/AppLayout.tsx` | Mobile tickets `Outlet` in `flex min-h-0 flex-1 flex-col overflow-hidden` |
| `client/src/features/tickets/components/TicketsLayout.tsx` | `h-full` on mobile panel container |
| `client/src/features/tickets/components/TicketPanel.tsx` | Mobile `fixed inset-0`; scroll inside panel body |

---

## 4. Docker Entrypoint CRLF (Windows)

**Context:** Exchange 40 — first Docker run failed with `no such file or directory` on entrypoint.

**Root cause:** Windows CRLF line endings in `docker-entrypoint.sh`.

**Fix:**

- Dockerfile strips `\r` from entrypoint
- `.gitattributes` enforces LF on `*.sh`

---

## 5. Development Environment Incidents (Non-Code)

Recorded in Exchange 11 during sidebar debugging:

| Issue | Resolution |
|-------|------------|
| PostgreSQL unreachable on `localhost:5433` | Docker DB started; health checks passed |
| Port 5432 busy locally | Dev compose maps **5433:5432**; `DATABASE_URL` updated |
| Transient `glass-elevated` unknown utility / `globals.css` import errors | Dev server restart after CSS iteration; resolved in visual refinement passes |

These were environment/session issues during iterative UI work, not shipped defects.

---

## 6. RBAC Validation Bugs (M3 Phase 1)

**Context:** Exchange 19 validation pass.

| Bug | Fix |
|-----|-----|
| Member had `VIEW_USERS` when spec required restriction initially | Removed from `MEMBER_PERMISSIONS` in validation pass |
| Generic 403 for `VIEW_USERS` / `ADD_COMMENT` | Permission-specific messages in `authorize.middleware.ts` |

**Follow-up (Exchange 20):** User decided all authenticated users need `GET /users` for assignee/reporter UI — `VIEW_USERS` restored for Member role with documented rationale.

---

## 7. API / Docs Drift

| Issue | Fix | Exchange |
|-------|-----|----------|
| Health `database` field: spec said `"connected"` vs boolean | API spec updated to `true`/`false` | 3 |
| Search param docs omitted `ticketNumber` | `05-api-specification.md` aligned | 19 |

---

## Debugging Approach Used

1. **Reproduce** — user-reported behaviour with specific viewport or filter state.
2. **Trace** — layout chain (flex/fixed), URL state (React Router), or RBAC/validation.
3. **Minimal fix** — no architecture changes; smallest diff.
4. **Verify** — lint/typecheck/build; manual or automated re-check.

Further process detail: [`tool-workflow.md`](./tool-workflow.md), [`code-review-notes.md`](./code-review-notes.md).
