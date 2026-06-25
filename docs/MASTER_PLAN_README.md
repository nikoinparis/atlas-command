# Master Plan README

`Atlas Command Master Plan.pdf` is the canonical reference for Atlas Command.

## Location

Place the PDF at:

```text
docs/Atlas Command Master Plan.pdf
```

This build also began with a copy of the PDF in the workspace root. The in-repo `docs/` copy should be treated as the implementation reference.

## How Future Coding Agents Should Use It

Before changing major architecture, naming, UI direction, safety rules, Treasury behavior, Atlas Allocation behavior, or roadmap priorities, inspect this PDF and align the change with it.

If a decision intentionally contradicts the master plan, document the reason in `docs/ARCHITECTURE_NOTES.md` or `docs/DECISION_LOG.md`.

## Sections That Matter Most For Implementation

- Product vision and the game world
- System architecture
- Building catalog
- The Right-Hand Man / HQ agent
- Treasury and Atlas Allocation
- Security, safety, and permissions
- Cost plan
- Roadmap
- Reference data model and lifecycle notes

## Key Implementation Rules

- Next.js + React should own the app shell, HUD, panels, routes, and chat.
- Phaser should own the 2.5D village canvas.
- The browser should never hold model, brokerage, payment, posting, or platform API keys.
- All posting, sending, spending, publishing, investing, and production code changes require human approval.
- Treasury and cost controls are part of the foundation, not a later add-on.
- Atlas Allocation stays decision-support and paper-mode until legal/compliance review.
- This is not passive income. Revenue buildings are experiments that require human work and honest measurement.
