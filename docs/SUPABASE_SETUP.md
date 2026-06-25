# Supabase Setup

Atlas Command still runs in mock mode by default. These notes prepare the database path without requiring credentials today.

## Create A Supabase Project

1. Create a new project in Supabase.
2. Keep the project region close to your primary users.
3. Do not paste service-role keys into client code.
4. Do not connect payment, posting, brokerage, or platform write integrations yet.

## Run The Schema

Open the Supabase SQL editor and run:

```text
supabase/schema.sql
```

The schema creates future tables for users, buildings, agents, tasks, task runs, approvals, conversations, messages, events, experiments, revenue events, cost events, Treasury records, settings, agent memory, room upgrades, and Atlas Allocation records.

## Run The Seed

After the schema succeeds, run:

```text
supabase/seed.sql
```

The seed adds a local operator, a small subset of buildings and agents, sample tasks, one pending approval, a Treasury snapshot, and one paper-mode Atlas Allocation record.

## Environment Variables

Mock mode:

```bash
NEXT_PUBLIC_DATA_SOURCE=mock
```

Future Supabase mode:

```bash
NEXT_PUBLIC_DATA_SOURCE=supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` must only be used from server-side code. It should never be exposed in the browser.

## Keep Mock Mode On

Leave `NEXT_PUBLIC_DATA_SOURCE` unset or set it to `mock`. The app defaults to mock if the flag is missing.

## Switch Later

Only switch to `NEXT_PUBLIC_DATA_SOURCE=supabase` after:

- server-side data access is implemented,
- row-level security policies are designed,
- cost controls exist,
- approval gates are durable,
- and the UI has a graceful fallback for missing credentials.

## Safety Note

No external side effects should bypass Approval Court. Posting, sending, spending, publishing, investing, and production code changes must stay human-approved even after Supabase is connected.
