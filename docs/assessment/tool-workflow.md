# Tool Workflow

This document describes how **Cursor** and AI assistance were used to build Quest. The chronological record is in [`prompt-history.md`](./prompt-history.md).

## Primary Tool

| Tool | Role |
|------|------|
| **Cursor IDE** | AI-assisted coding, planning, verification, and documentation |
| **Cursor Agent** | Multi-step implementation following project rules |
| **`.cursor/rules/project.mdc`** | Persistent project rules (doc precedence, milestone workflow, architecture constraints) |

## Development Pattern

Every major feature followed the workflow defined in [`.cursor/rules/project.mdc`](../../.cursor/rules/project.mdc) and [`docs/06-project-plan.md`](../06-project-plan.md):

1. Read relevant documentation (PRD → UI/UX → architecture → API → project plan → testing strategy).
2. **Plan first** — AI explains implementation plan, file list, and order; **no code until user approval**.
3. Implement backend.
4. Verify backend (lint, typecheck, build, manual API checks).
5. Implement frontend.
6. Integrate and verify.
7. Cleanup / review pass before next milestone.

This pattern appears in every milestone start prompt (Exchanges 1, 4, 14, 16, 20, 25, etc. in `prompt-history.md`).

## User ↔ AI Interaction Model

### Approval gates

User consistently required explicit approval before implementation:

- *"Wait for my approval before writing any code."*
- *"Approved with the following adjustments before implementation."*

Adjustments were recorded as binding decisions (e.g. no `AppError.ts`, boolean `database` on health endpoint, postpone shadcn until M2, access token in memory only). See **Decision** blocks in `prompt-history.md`.

### Iterative refinement

Visual work used multiple passes driven by user feedback:

- UI reference images as **primary source of truth** (not generic purple dashboard).
- Background iteration: corner blobs → 15 scattered ambient spheres (`AmbientBackground.tsx`).
- Sidebar responsive behaviour specified per breakpoint (desktop / tablet / mobile).

### Verification-only tasks

Between milestones, user issued **non-feature** prompts:

- Final verification (lint, typecheck, build, health endpoint).
- Production-readiness cleanup (dead code, docs sync, env examples).
- Pre-commit review (architecture, TanStack Query, RBAC).

AI was instructed **not** to add features during these passes.

## Milestone Progression

| Phase | Focus | Key exchanges (`prompt-history.md`) |
|-------|-------|--------------------------------------|
| Planning | Doc alignment, M1 plan | Exchange 1 |
| Backend Foundation | Express, Prisma, health | Exchanges 2–3 |
| Frontend Foundation | Theme, layouts, glassmorphism | Exchanges 4–10 |
| Bug Fixes | Mobile sidebar, filters, panel height | Exchanges 11, 24, 26 |
| Documentation / Review | M1–M3 cleanup and review | Exchanges 12–13, 15, 17, 22–23 |
| Authentication | Frontend auth integration | Exchanges 14–15 |
| Ticket Management | Backend + workspace + editing | Exchanges 16–22 |
| Dashboard | Aggregated dashboard | Exchanges 25–26 |
| Final Review | Stretch goals audit | Exchange 27 |
| Stretch | Reporter, Swagger, tests, Docker, CI | Exchanges 28–43 |

## AI Constraints Enforced by User

Documented in prompts and reflected in implementation:

- Follow API contract and database schema exactly.
- No architectural changes without explicit approval.
- Thin controllers; business logic in services.
- Reuse existing patterns; no duplicate utilities.
- Update existing docs instead of creating new spec files (except assessment artifacts).
- Milestone-by-milestone — do not start next until current is complete.

## Communication Style

`/caveman` mode was used in some early prompts for terse approval messages. Project rules also require the Caveman skill for AI responses during development.

## References

- Full prompt/response log: [`prompt-history.md`](./prompt-history.md)
- Cursor rules snapshot: [`cursor-workflow/cursor-rules-or-instructions.md`](./cursor-workflow/cursor-rules-or-instructions.md)
- AI usage summary: [`final-ai-usage-summary.md`](./final-ai-usage-summary.md)
