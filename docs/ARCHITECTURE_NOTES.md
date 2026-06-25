# Architecture Notes

## Current Local Mock Architecture

The app uses static mock data under `lib/mock-data/` and strong domain types under `lib/types/atlas.ts`. `lib/data/` now exposes a mock-first data-source abstraction plus a Supabase placeholder, but the runtime still imports mock data directly where that keeps the UI simple and stable.

React renders the shell, HUD, bottom dock, drawers, overlays, task board, Approval Court, Treasury dashboard, settings, and docs. Phaser renders only the village canvas and emits building selection events back to React.

The dashboard/base routes now use a village-first layout:

- compact top HUD,
- full-screen Phaser village,
- bottom dock navigation,
- collapsible left Agent Crew drawer,
- floating right selected-building/agent details overlay,
- compact event log drawer.

## Future Supabase Architecture

Move mock records into Supabase Postgres tables aligned with the master plan. Initial SQL lives in `supabase/schema.sql` and sample rows live in `supabase/seed.sql`.

- users
- buildings
- agents
- tasks
- task_runs
- conversations
- messages
- approvals
- tools
- experiments
- revenue_events
- cost_events
- metrics
- agent_memory
- logs
- room_upgrades
- treasury_records
- atlas_allocation_records

Financial and audit data should be append-only where possible.

Mock mode remains default through `NEXT_PUBLIC_DATA_SOURCE=mock` or an unset data-source flag. The Supabase data source should stay a stub until credentials, server-side access, row-level security, and durable approval gates are implemented.

## Future Worker / Queue Architecture

The UI should create task rows through server-side APIs. A Python worker should consume queued tasks, run LangGraph workflows behind a cost governor, write task run state and cost events, and pause side-effecting work at durable approval checkpoints.

Recommended later pieces from the master plan:

- Python FastAPI worker
- Render or Railway worker service
- Upstash Redis + BullMQ or QStash
- Scheduled jobs for nightly Treasury and Atlas runs

## Future LLM Architecture

Do not call model APIs from the browser. Add a server-side model router that chooses cheap, workhorse, or flagship tiers based on task type. Every model call should check daily and per-task caps before execution and write a cost event after execution.

## Phaser And React Separation

Phaser owns:

- isometric grass/ground tiles
- paths, trees, rocks, fences, shadows, and placeholder scenery
- building shapes
- floating building labels
- status glows
- hover and click hit testing
- simple agent markers and animations

React owns:

- routes
- HUD
- panels
- cards
- Approval Court
- Treasury
- chat
- settings

The contract is intentionally small: Phaser calls `onSelectBuilding(buildingId)`, and React passes back the selected building id for highlighting.
