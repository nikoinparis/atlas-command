# NEXT STEPS

## Day 1 Morning Checklist

- Run `npm install`.
- Run `npm run dev`.
- Open `http://localhost:3000/dashboard` and inspect the UI.
- Click each building on the village canvas.
- Test Atlas chat prompts.
- Visit `/buildings`, `/agents`, `/tasks`, `/approvals`, `/treasury`, `/settings`, and `/docs`.
- Run `npm run build`.
- Fix any build or lint errors before adding features.
- Create a GitHub repo.
- Push the repo.
- Connect the repo to Vercel.
- Create a Supabase project later.
- Add the database schema later.
- Replace mock data with Supabase gradually.
- Add real LLM chat only after cost controls exist.

## Next 7 Days

- Add a Mission Control route for task triage and queue health.
- Add a global kill switch UI placeholder.
- Design the Supabase schema from the master plan tables.
- Add database migrations for buildings, agents, tasks, task_runs, approvals, messages, experiments, cost_events, revenue_events, logs, treasury_records, and atlas_allocation_records.
- Add a server-side mock task API so the UI is ready for real persistence.
- Add basic E2E smoke tests for dashboard load, building selection, approvals, and Treasury render.
- Refine Phaser visuals and add better mobile layout behavior.

## Next 30 Days

- Connect Supabase Auth and Postgres.
- Persist tasks and approvals.
- Add append-only cost and revenue ledgers.
- Build the first real task lifecycle: queued to running to waiting_approval to completed or rejected.
- Add a Python worker scaffold, but keep it disconnected from real providers until the cost governor exists.
- Add model routing abstractions and token/cost estimation.
- Add Right-Hand Man daily briefing from database summaries.
- Add GitHub PR proposal flow for Engineering Workshop.

## Cheapest Cost Path

- Keep Vercel Hobby while the app is local/mock.
- Keep Supabase free until daily use requires Pro.
- Avoid real LLM calls until budgets, per-task caps, retries, and logging exist.
- Use cheap model tiers for summaries and extraction once live calls start.
- Keep Atlas Allocation display-only and paper-mode.
- Avoid social posting, mass outreach, brokerage, and payment integrations until approval gates and audit logs are durable.

## What Not To Add Yet

- No real brokerage live trading.
- No auto-posting or social engagement bots.
- No Fiverr/Etsy/TikTok write integrations.
- No autonomous spending.
- No browser-exposed API keys.
- No Right-Hand Man direct production deploys or secret changes.
- No OpenClaw core orchestration unless the master plan is explicitly revised.
