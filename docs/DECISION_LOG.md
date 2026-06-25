# Decision Log

## 2026-06-25

### Decision

Create `atlas-command` as a Next.js App Router project with React, TypeScript, Tailwind CSS, Phaser 3, and local mock data.

### Why

This matches the master plan recommendation for the web app shell and the requested overnight build constraints. It creates a deployable foundation without requiring Supabase, LLM keys, or external integrations.

### Alternatives Considered

- Vite + React: lighter, but would require more routing and deployment structure.
- Pure canvas/SVG village: simpler dependency story, but less extensible for game-style interactions.
- Real database now: useful later, but violates the no-credentials-yet constraint.

### Master Plan Link

Aligned with Part 0, Part II, and Appendix A.

## 2026-06-25

### Decision

Keep all side-effecting actions as Approval Court cards with local state only.

### Why

The master plan repeatedly states that posting, sending, spending, publishing, investing, and production code changes require human approval. Local state demonstrates the workflow without creating unsafe automation.

### Alternatives Considered

- Mock automatic execution after approval: deferred until durable audit and worker checkpoints exist.
- Real platform integrations: explicitly out of scope for the first local build.

### Master Plan Link

Aligned with Part I, Part IV, Part VII, and Part VIII.

## 2026-06-25

### Decision

Represent Atlas Allocation as a paper/display-only building.

### Why

The master plan says Atlas should be wrapped later as a separate Python service and kept decision-support first. Real trading or paid advice requires compliance review.

### Alternatives Considered

- Reimplement quant logic in Next.js: rejected because the plan says to keep Atlas as its own Python service.
- Add brokerage keys now: rejected because this build should not require credentials or touch real money.

### Master Plan Link

Aligned with Part VI and Part VIII.
