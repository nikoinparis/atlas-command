# Architecture Notes

## Current Local Mock Architecture

The app uses static mock data under `lib/mock-data/` and strong domain types under `lib/types/atlas.ts`. `lib/data/` now exposes a mock-first data-source abstraction plus a Supabase placeholder, but the runtime still imports mock data directly where that keeps the UI simple and stable.

React renders the shell, HUD, bottom dock, drawers, overlays, task board, Approval Court, Treasury dashboard, settings, and docs. Phaser renders only the village canvas and emits building selection events back to React.

The Base route is the primary village-first layout. `/` and `/dashboard` redirect to `/base` for compatibility:

- compact top HUD,
- full-screen Phaser village,
- bottom dock navigation,
- collapsible left Agent Crew drawer,
- floating right selected-building/agent details overlay,
- compact event log drawer.

The HUD, drawers, details panel, event log, and dock should behave as floating glass overlays over the Phaser map. Crew, Details, and Log controls sit below the top HUD with a clear gap. Side overlays share a bounded top and bottom rhythm, scroll internally, and stop above the bottom dock so the village remains visible and interactive.

The details panel starts closed. It opens when a building or crew agent is selected, or when the user presses Details. If no entity is selected, the panel shows a compact empty state instead of defaulting to HQ.

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

- organic grass/ground variation without a visible tile grid
- paths, trees, rocks, fences, bushes, flowers, shadows, and placeholder scenery
- building rendering through `lib/game/buildingAssets.ts`
- PNG/WebP building sprites loaded from `public/assets/buildings/`
- generated fallback building silhouettes when sprite assets are not enabled, missing, or fail to load
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

## Art Pipeline

`docs/ART_PIPELINE.md` defines the sprite workflow, naming conventions, recommended dimensions, prompt templates, licensing cautions, and registry fields for click zones, labels, anchors, and shadows. Building art lives in `public/assets/buildings/`, while scale, anchor, label, status, click-zone, and shadow tuning stays centralized in `lib/game/buildingAssets.ts`.
