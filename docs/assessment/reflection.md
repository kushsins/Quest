# Reflection

Personal reflection on building Quest with AI-assisted development. Grounded in [`prompt-history.md`](./prompt-history.md) and project outcomes.

---

## What Worked Well

### Documentation-first delivery

Starting each milestone by reading ordered docs (`01`–`07`) and requiring an implementation plan **before code** kept the codebase aligned with the API contract and schema. When drift appeared (health `database` type, search fields, DBML paths), it was caught early and fixed in documentation first.

### Approval gates with adjustments

The pattern *"Approved with the following adjustments"* proved effective. User constraints (no `AppError.ts`, in-memory access token, boolean health field, milestone scope boundaries) were unambiguous and traceable. AI did not expand scope without explicit approval.

### Milestone isolation

Backend → verify → frontend → integrate reduced integration risk. Ticket module validation (45 API checks) before Phase 2 frontend caught RBAC issues before UI work depended on wrong permissions.

### Iterative visual refinement

Foundation UI required multiple passes against reference images. User feedback was specific (sidebar width, ambient blobs, mobile overlay). Treating references as source of truth avoided generic "purple dashboard" drift.

---

## Challenges

### Visual fidelity vs velocity

Glassmorphism and responsive sidebar took more iterations than functional features. Trade-off: strong design foundation for M3/M4, but time-intensive.

### Permission model iteration

`VIEW_USERS` was restricted during validation, then expanded by user decision for UX. Shows value of validation before frontend — and that product calls can override initial RBAC strictness when documented.

### React URL state pitfalls

The advanced-filter clear bug (batched `setSearchParams`) was subtle. Automated `useTicketFilters` tests (23 cases) now guard URL synchronization behaviour.

### Environment friction

Windows CRLF broke Docker entrypoint; local port 5432 conflicts pushed Postgres to 5433. Both required operational fixes unrelated to application logic.

---

## AI Tooling Observations

### Strengths

- Rapid scaffolding matching documented folder structure
- Consistent module patterns (controller → service → validation)
- Thorough pre-implementation plans and file lists
- Cleanup and review passes across large surface area

### Risks managed by process

- **Scope creep** — mitigated by milestone prompts and "no features during cleanup"
- **Architecture drift** — mitigated by "stop and ask" rule
- **Hallucinated requirements** — mitigated by doc precedence in `project.mdc`
- **Mislabeled exports** in prompt history — preserved in assessment artifacts for transparency

### Human role

User acted as product owner, reviewer, and visual QA. AI implemented and proposed; user approved, rejected, or refined. Critical decisions (VIEW_USERS for all users, reporter filter, stretch priority) were human.

---

## Testing & Quality

Stretch goal testing added confidence but low global coverage by design. Manual testing remained primary per [`07-testing-strategy.md`](../07-testing-strategy.md); automated suites focus on high-risk logic (auth, RBAC, filters, validation).

CI (GitHub Actions) closes the loop so verification is repeatable for reviewers.

---

## If Starting Again

1. Keep plan-then-implement for every milestone.
2. Run API validation immediately after backend phases.
3. Add `useTicketFilters`-level tests earlier when URL state is introduced.
4. Document permission UX needs before RBAC seeding.
5. Enforce LF for shell scripts from day one on Windows.

---

## Outcome

Quest ships MVP milestones 1–4 plus meaningful stretch goals (tests, Docker, CI, Swagger, reporter filter) with traceable AI workflow documentation. The process produced a maintainable monorepo that follows its own written specifications.

---

## References

- Process log: [`prompt-history.md`](./prompt-history.md)
- Tooling: [`tool-workflow.md`](./tool-workflow.md)
- AI summary: [`final-ai-usage-summary.md`](./final-ai-usage-summary.md)
