# Architecture Notes

## Current Local Mock Architecture

The app uses static mock data under `lib/mock-data/` and strong domain types under `lib/types/atlas.ts`. React renders the shell, HUD, side panels, task board, Approval Court, Treasury dashboard, settings, and docs. Phaser renders only the village canvas and emits building selection events back to React.

## Future Supabase Architecture

Move mock records into Supabase Postgres tables aligned with the master plan:

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

- isometric tiles
- building shapes
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
