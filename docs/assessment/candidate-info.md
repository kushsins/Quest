# Candidate Information

| Field | Value |
|-------|-------|
| **Name** | Kushagra Singh |
| **Project** | Quest — Modern Support Ticket Management Platform |
| **Exercise** | JS AI Capability Exercise |
| **Repository** | Quest monorepo (`client/`, `server/`, `docs/`) |

## Submission Scope

Quest Version 1 delivers the documented MVP:

- **Milestone 1** — Foundation (health, layouts, theme, glassmorphism design system)
- **Milestone 2** — Authentication & Authorization
- **Milestone 3** — Ticket Management
- **Milestone 4** — Dashboard
- **Stretch goals** — Reporter filter, Swagger/OpenAPI, backend & frontend automated tests, Docker full stack, GitHub Actions CI

See [`docs/06-project-plan.md`](../06-project-plan.md) for the official milestone breakdown.

## Official Project Documentation

These documents define implementation requirements and are **not** duplicated here:

| Document | Path |
|----------|------|
| Product Requirements | [`docs/01-product-requirements.md`](../01-product-requirements.md) |
| UI/UX Specification | [`docs/02-ui-ux-specification.md`](../02-ui-ux-specification.md) |
| System Architecture | [`docs/03-system-architecture.md`](../03-system-architecture.md) |
| Database Design | [`docs/04-database-design.md`](../04-database-design.md) |
| API Specification | [`docs/05-api-specification.md`](../05-api-specification.md) |
| Project Plan | [`docs/06-project-plan.md`](../06-project-plan.md) |
| Testing Strategy | [`docs/07-testing-strategy.md`](../07-testing-strategy.md) |

## Assessment Artifacts

| Document | Purpose |
|----------|---------|
| [`README.md`](./README.md) | Index of assessment deliverables |
| [`prompt-history.md`](./prompt-history.md) | Chronological AI development record (source of truth for process) |
| [`tool-workflow.md`](./tool-workflow.md) | How Cursor and AI were used |
| [`acceptance-criteria.md`](./acceptance-criteria.md) | Submission acceptance mapping |
| [`test-results.md`](./test-results.md) | Automated and manual verification summary |
| [`debugging-notes.md`](./debugging-notes.md) | Bugs encountered and fixes |
| [`code-review-notes.md`](./code-review-notes.md) | Review cycles and findings |
| [`review-fixes.md`](./review-fixes.md) | Changes made after review |
| [`reflection.md`](./reflection.md) | Process reflection |
| [`pr-description.md`](./pr-description.md) | Pull request summary |
| [`final-ai-usage-summary.md`](./final-ai-usage-summary.md) | AI usage overview |
| [`cursor-workflow/`](./cursor-workflow/) | Cursor project context and rules |

## Tech Stack Summary

See [`readme.md`](../../readme.md) for setup. Core stack: React 19 + Vite + TypeScript (client), Express + Prisma + PostgreSQL (server), Docker Compose, GitHub Actions CI, Node.js 22 (`.nvmrc`).
