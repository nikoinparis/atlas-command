# Atlas Command

Atlas Command is a gamified AI-agent business operating system. The first local build is a fantasy 2.5D village where each building represents a real business function: agents, tasks, costs, revenue, approvals, and status are visible in one operating surface.

This repository is intentionally local-first. It uses mock data now, with clean seams for Supabase, workers, and LLM APIs later.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Phaser 3 for the village canvas
- Framer Motion installed for future panel motion
- Local shadcn/ui-style components
- Local mock data, no database required yet

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The root route redirects to `/dashboard`.

## Build And Lint

```bash
npm run lint
npm run build
```

## Folder Structure

- `app/` - App Router pages for dashboard, base, buildings, agents, tasks, approvals, treasury, settings, and docs
- `components/game/` - React wrapper for the Phaser canvas
- `components/phaser/` - Phaser scene, visual palettes, and game types
- `components/hud/` - top HUD, agent roster, event log, and budget bar
- `components/panels/` - building, agent, chat, task, approval, treasury, and settings panels
- `components/cards/` - repeated cards for entities and metrics
- `components/ui/` - local button, card, badge, tabs, progress, and dialog primitives
- `lib/data/` - mock-first data-source abstraction with a future Supabase stub
- `lib/types/` - Atlas domain types
- `lib/mock-data/` - local buildings, agents, tasks, approvals, events, and Treasury records
- `lib/finance/` - ROI and Treasury calculations
- `lib/agents/` - mock Right-Hand Man responses and registry helpers
- `docs/` - master plan PDF and implementation notes
- `supabase/` - future schema and seed SQL

## Current Features

- Village-first dashboard at `/dashboard` and `/base`
- Phaser 3 isometric-style village canvas with clickable buildings, paths, trees, scenery, shadows, and floating labels
- Building status glows for idle, working, waiting approval, blocked, error, and upgrading
- Compact game-style top HUD with cash, revenue, expenses, AI spend, active tasks, approvals, risk alerts, and budget usage
- Bottom dock navigation for all primary routes
- Collapsible left Agent Crew drawer with manager status, current task, model tier, and safety policy
- Floating right details overlay for selected agent, selected building, current tasks, completed tasks, bottlenecks, ROI, and recommended action
- Compact event log drawer opened from the village controls
- Mock chat with Atlas, the Right-Hand Man
- Standalone routes for buildings, agents, tasks, approvals, Treasury, settings, and docs
- Approval cards with local approve, reject, and request revision state
- Treasury dashboard with cost events, revenue events, ROI, AI usage log, budget controls, and Atlas Allocation paper-mode placeholder
- Supabase schema, seed, setup docs, `.env.example`, and mock-first data-source abstraction

## Mock vs Real Systems

Mock now:

- Agents and task runs
- Approval queue
- Treasury records, revenue events, cost events, ROI
- Atlas chat responses
- Atlas Allocation paper dashboard
- Settings and budget controls

Future real systems:

- Supabase Postgres, Auth, Storage, and Realtime
- Python worker service for agent runs
- Queue and scheduled jobs
- LLM API routing through a cost governor
- Stripe/Etsy/Fiverr/social/brokerage connectors only after approval gates exist

Mock mode remains the default. Leave `NEXT_PUBLIC_DATA_SOURCE` unset or set it to `mock`. The Supabase data source is a placeholder and should not be enabled until server-side data access, RLS, and durable approval gates exist.

## Safety Rules

- The browser never receives model, brokerage, payment, or posting API keys.
- Anything involving posting, sending, spending, publishing, investing, or code changes must route through Approval Court.
- Atlas Allocation is paper/display-only in this build.
- Agents draft and propose. Humans approve real-world actions.
- The Treasury and future cost governor must log every model call before real LLM keys are added.
- This is not passive income. Every revenue building is a real experiment with real work, failure rates, and platform risk.

## Master Plan

`docs/Atlas Command Master Plan.pdf` is the canonical product, architecture, safety, and roadmap reference. Future implementation decisions should stay aligned with its guidance on Next.js, Phaser, Treasury, the Right-Hand Man, approval gates, cost controls, Atlas Allocation paper mode, and the cheapest-path roadmap.

## Vercel Deployment Notes

The app should deploy as a standard Next.js project. No environment variables are required for this mock build. Add Supabase and LLM environment variables later only after server-side APIs, cost controls, and approval gates are implemented.

See `docs/SUPABASE_SETUP.md` for the future database setup path.

## Future Integrations

- Supabase: persist users, buildings, agents, tasks, task runs, approvals, messages, experiments, cost events, revenue events, logs, Treasury records, and Atlas allocation records.
- LLM APIs: add a server-side model router and cost governor before live calls.
- Worker/queue: add a Python FastAPI worker with durable task checkpoints and approval pause states.
- GitHub: route Right-Hand Man code changes through branch, pull request, tests, preview, and human merge.
