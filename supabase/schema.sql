create extension if not exists "pgcrypto";

do $$ begin
  create type agent_status as enum ('idle', 'thinking', 'working', 'waiting_approval', 'blocked', 'error', 'completed');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type task_status as enum ('idle', 'queued', 'running', 'waiting_approval', 'blocked', 'error', 'completed', 'rejected');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type building_status as enum ('idle', 'working', 'waiting_approval', 'blocked', 'error', 'upgrading');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type risk_level as enum ('low', 'medium', 'high', 'critical');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type approval_status as enum ('pending', 'approved', 'rejected', 'revision_requested');
exception when duplicate_object then null;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text unique,
  display_name text,
  settings jsonb not null default '{}'::jsonb,
  budget_caps jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table users is 'Atlas Command operators. Multi-user later; single-player first.';

create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  slug text not null,
  name text not null,
  short_name text not null,
  category text not null,
  status building_status not null default 'idle',
  level integer not null default 1,
  position jsonb not null default '{}'::jsonb,
  description text,
  visual text,
  manager_agent_id uuid,
  risk_level risk_level not null default 'low',
  tools jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);
comment on table buildings is 'Village buildings and rooms that represent real business functions.';

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  building_id uuid references buildings(id) on delete set null,
  slug text not null,
  name text not null,
  title text not null,
  role text not null,
  status agent_status not null default 'idle',
  current_task text,
  model_tier text not null default 'cheap',
  tool_policy text,
  tool_allowlist jsonb not null default '[]'::jsonb,
  risk_level risk_level not null default 'low',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);
comment on table agents is 'Manager and worker agent configuration with explicit tool permissions.';

alter table buildings
  add constraint buildings_manager_agent_id_fkey
  foreign key (manager_agent_id) references agents(id) on delete set null
  not valid;

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  building_id uuid references buildings(id) on delete set null,
  agent_id uuid references agents(id) on delete set null,
  title text not null,
  type text not null default 'mock',
  status task_status not null default 'queued',
  summary text,
  params jsonb not null default '{}'::jsonb,
  cost_estimate numeric(12, 4) not null default 0,
  expected_value text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table tasks is 'Units of work created by the UI and processed by future workers.';

create table if not exists task_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  status task_status not null default 'queued',
  graph_state jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  cost numeric(12, 4) not null default 0,
  result jsonb not null default '{}'::jsonb,
  result_preview text,
  error text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table task_runs is 'Durable execution attempts, including future LangGraph checkpoints.';

create table if not exists approvals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  task_run_id uuid references task_runs(id) on delete set null,
  source_agent_id uuid references agents(id) on delete set null,
  building_id uuid references buildings(id) on delete set null,
  title text not null,
  status approval_status not null default 'pending',
  summary text,
  risk_level risk_level not null default 'medium',
  side_effect_type text not null,
  expected_benefit text,
  estimated_cost numeric(12, 4) not null default 0,
  output_preview text,
  action_preview jsonb not null default '{}'::jsonb,
  decided_by uuid references users(id) on delete set null,
  decided_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table approvals is 'Approval Court queue for posting, sending, spending, publishing, code, and investing actions.';

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  building_id uuid references buildings(id) on delete set null,
  agent_id uuid references agents(id) on delete set null,
  title text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table conversations is 'Chat threads with Atlas or building manager agents.';

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'agent', 'system', 'tool')),
  content text not null,
  tokens integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table messages is 'Conversation messages and future token accounting.';

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  building_id uuid references buildings(id) on delete set null,
  agent_id uuid references agents(id) on delete set null,
  message text not null,
  risk_level risk_level not null default 'low',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table events is 'Village event log and operator-facing feed.';

create table if not exists experiments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  building_id uuid references buildings(id) on delete set null,
  name text not null,
  hypothesis text,
  status text not null default 'planned',
  risk_level risk_level not null default 'medium',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table experiments is 'Revenue and resource-allocation experiments tracked by Treasury.';

create table if not exists revenue_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  experiment_id uuid references experiments(id) on delete set null,
  building_id uuid references buildings(id) on delete set null,
  label text not null,
  gross numeric(12, 2) not null default 0,
  fees numeric(12, 2) not null default 0,
  net numeric(12, 2) not null default 0,
  occurred_on date not null default current_date,
  source text not null default 'manual',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table revenue_events is 'Append-only revenue ledger stream.';

create table if not exists cost_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  experiment_id uuid references experiments(id) on delete set null,
  building_id uuid references buildings(id) on delete set null,
  task_run_id uuid references task_runs(id) on delete set null,
  label text not null,
  category text not null,
  amount numeric(12, 4) not null default 0,
  occurred_on date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table cost_events is 'Append-only cost ledger stream, including every future model call.';

create table if not exists treasury_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  cash_on_hand numeric(12, 2) not null default 0,
  revenue_mtd numeric(12, 2) not null default 0,
  expenses_mtd numeric(12, 2) not null default 0,
  ai_spend_mtd numeric(12, 4) not null default 0,
  hosting_spend_mtd numeric(12, 2) not null default 0,
  profit_mtd numeric(12, 2) not null default 0,
  approval_risk_exposure numeric(12, 2) not null default 0,
  snapshot_date date not null default current_date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table treasury_records is 'Periodic Treasury snapshots for cash, spend, P&L, runway, and risk.';

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique,
  monthly_ai_budget numeric(12, 2) not null default 50,
  daily_ai_budget numeric(12, 2) not null default 2,
  max_task_cost numeric(12, 2) not null default 0.25,
  max_runs_per_task integer not null default 3,
  require_approval_above numeric(12, 2) not null default 0.25,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table settings is 'Operator budget caps, UI settings, and future provider preferences.';

create table if not exists agent_memory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  agent_id uuid references agents(id) on delete cascade,
  content text not null,
  embedding jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table agent_memory is 'Future retrieval memory. Embeddings are JSONB until pgvector is enabled.';

create table if not exists room_upgrades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  building_id uuid references buildings(id) on delete cascade,
  level integer not null default 1,
  perks jsonb not null default '[]'::jsonb,
  cost numeric(12, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
comment on table room_upgrades is 'Base-builder progression state for building upgrades and unlocked capabilities.';

create table if not exists atlas_allocation_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  params jsonb not null default '{}'::jsonb,
  weights jsonb not null default '{}'::jsonb,
  signals jsonb not null default '{}'::jsonb,
  metrics jsonb not null default '{}'::jsonb,
  rationale text,
  mode text not null default 'paper',
  created_at timestamptz not null default now()
);
comment on table atlas_allocation_records is 'Display-only or paper-mode Atlas Allocation outputs. No live trading side effects.';

create index if not exists buildings_user_status_idx on buildings(user_id, status);
create index if not exists agents_user_building_idx on agents(user_id, building_id);
create index if not exists tasks_user_status_idx on tasks(user_id, status);
create index if not exists tasks_building_status_idx on tasks(building_id, status);
create index if not exists task_runs_task_created_idx on task_runs(task_id, created_at desc);
create index if not exists approvals_user_status_idx on approvals(user_id, status);
create index if not exists messages_conversation_created_idx on messages(conversation_id, created_at);
create index if not exists events_user_created_idx on events(user_id, created_at desc);
create index if not exists experiments_user_status_idx on experiments(user_id, status);
create index if not exists revenue_events_experiment_date_idx on revenue_events(experiment_id, occurred_on desc);
create index if not exists cost_events_experiment_date_idx on cost_events(experiment_id, occurred_on desc);
create index if not exists treasury_records_user_date_idx on treasury_records(user_id, snapshot_date desc);
create index if not exists agent_memory_agent_created_idx on agent_memory(agent_id, created_at desc);
create index if not exists atlas_records_user_created_idx on atlas_allocation_records(user_id, created_at desc);
