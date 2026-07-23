# Assessment Submission — Quest

This folder contains deliverables for the **JS AI Capability Exercise** submission. Official product and technical specs remain in `docs/01`–`07`.

## Candidate

See [candidate-info.md](./candidate-info.md).

## Core deliverables

| Document | Purpose |
|----------|---------|
| [prompt-history.md](./prompt-history.md) | Chronological AI-assisted development log |
| [tool-workflow.md](./tool-workflow.md) | How Cursor and AI tools were used |
| [acceptance-criteria.md](./acceptance-criteria.md) | MVP and stretch acceptance mapping |
| [test-results.md](./test-results.md) | Automated and manual test summary |
| [debugging-notes.md](./debugging-notes.md) | Notable bugs and fixes |
| [code-review-notes.md](./code-review-notes.md) | Review findings |
| [review-fixes.md](./review-fixes.md) | Fixes applied after review |
| [reflection.md](./reflection.md) | Lessons learned |
| [pr-description.md](./pr-description.md) | PR-style summary |
| [final-ai-usage-summary.md](./final-ai-usage-summary.md) | AI usage overview |

## Cursor workflow

| Document | Purpose |
|----------|---------|
| [cursor-workflow/project-context.md](./cursor-workflow/project-context.md) | Project context for agents |
| [cursor-workflow/spec.md](./cursor-workflow/spec.md) | Condensed spec |
| [cursor-workflow/tasks.md](./cursor-workflow/tasks.md) | Task breakdown |
| [cursor-workflow/acceptance-criteria.md](./cursor-workflow/acceptance-criteria.md) | Agent-facing acceptance criteria |
| [cursor-workflow/cursor-rules-or-instructions.md](./cursor-workflow/cursor-rules-or-instructions.md) | Rules and instructions used |

## Quick verification

From repo root:

```bash
cd server && npm run lint && npm run typecheck && npm run test && npm run build
cd ../client && npm run lint && npm run typecheck && npm run test && npm run build
```

Optional: `docker compose up --build` for full stack smoke test.
