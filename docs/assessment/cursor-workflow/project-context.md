# Project Context (Cursor Workflow)

Context file for Cursor agents working on **Quest**. Implementation truth lives in official docs; process truth in [`../prompt-history.md`](../prompt-history.md).

---

## Project

**Quest** — internal support ticket management (glassmorphism UI, Express API, PostgreSQL).

**Candidate:** Kushagra Singh  
**Status:** MVP Milestones 1–4 complete; stretch goals (tests, Docker, CI, Swagger) implemented.

---

## Repository Layout

```text
quest/
├── client/          # React 19 + Vite + TypeScript
├── server/          # Express + Prisma + TypeScript
├── docker/          # DB-only compose (dev port 5433)
├── docker-compose.yml   # Full stack (root)
├── docs/            # Product & engineering specs (01–07)
├── docs/assessment/ # Submission & AI workflow artifacts
└── .cursor/rules/   # Agent rules
```

---

## Source of Truth (read before coding)

| Order | Document |
|-------|----------|
| 1 | `docs/01-product-requirements.md` |
| 2 | `docs/02-ui-ux-specification.md` |
| 3 | `docs/03-system-architecture.md` |
| 4 | `docs/04-database-design.md` |
| 5 | `docs/05-api-specification.md` |
| 6 | `docs/06-project-plan.md` |
| 7 | `docs/07-testing-strategy.md` |

**Do not** duplicate or contradict these in new specs.

---

## Current Implementation State

| Milestone | Status |
|-----------|--------|
| M1 Foundation | Complete |
| M2 Authentication | Complete |
| M3 Ticket Management | Complete |
| M4 Dashboard | Complete |
| M5 Stretch | Partially complete (see project plan §7) |

**Modules:** `health`, `auth`, `tickets`, `dashboard`, `users` (backend); matching `features/*` (frontend).

---

## Environment

- **Node:** 22 (`.nvmrc`)
- **DB (dev):** `docker compose -f docker/docker-compose.yml up -d` → `localhost:5433`
- **DB (full stack):** `docker compose up --build` from root
- **Seed users:** `manager@quest.com`, `member@quest.com` / `password123`

---

## Constraints

- Thin controllers; logic in services
- Standard `ApiResponse` / `ApiError`
- No schema or API contract changes without explicit instruction
- One milestone at a time; verify before next
- Update existing docs — do not create parallel spec files

---

## Assessment

Submission artifacts under `docs/assessment/`. AI chronology: `docs/assessment/prompt-history.md`.

---

## Related

- [`spec.md`](./spec.md) — condensed requirements pointer
- [`tasks.md`](./tasks.md) — milestone task checklist
- [`acceptance-criteria.md`](./acceptance-criteria.md) — submission criteria
- [`cursor-rules-or-instructions.md`](./cursor-rules-or-instructions.md) — agent instructions
