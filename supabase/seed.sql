insert into users (id, email, display_name, budget_caps)
values (
  '00000000-0000-0000-0000-000000000001',
  'local@atlas-command.dev',
  'Local Operator',
  '{"dailyAiBudget":2,"monthlyAiBudget":50,"maxTaskCost":0.25}'::jsonb
)
on conflict (id) do nothing;

insert into buildings (id, user_id, slug, name, short_name, category, status, level, position, description, risk_level)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'keep-hall', 'Keep Hall / HQ', 'HQ', 'core', 'working', 1, '{"x":0,"y":-120}', 'Home of Atlas and the village briefing.', 'medium'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'treasury', 'Treasury', 'Treasury', 'core', 'working', 1, '{"x":-180,"y":-20}', 'Financial truth layer for revenue, costs, and ROI.', 'low'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'content-studio', 'Content Studio', 'Studio', 'revenue', 'waiting_approval', 1, '{"x":180,"y":-10}', 'Drafts content for human review.', 'medium'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'approval-court', 'Approval Court', 'Court', 'core', 'waiting_approval', 1, '{"x":0,"y":-10}', 'Human gate for side-effecting actions.', 'critical'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'allocation-tower', 'Atlas Treasury / Allocation Tower', 'Atlas Tower', 'future', 'working', 1, '{"x":160,"y":230}', 'Paper-mode allocation decision support.', 'critical')
on conflict (id) do nothing;

insert into agents (id, user_id, building_id, slug, name, title, role, status, current_task, model_tier, tool_policy, risk_level)
values
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'atlas', 'Atlas', 'Right-Hand Man / Chief of Staff', 'Summarizes the village and proposes next actions.', 'thinking', 'Preparing the village briefing.', 'flagship', 'Read broadly; propose freely; never execute side effects.', 'medium'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'ledger', 'Ledger', 'Treasury Manager', 'Tracks cost, revenue, and ROI.', 'working', 'Reconciling cost events.', 'cheap', 'Narrative analysis only; numbers come from SQL.', 'low'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'nova', 'Nova', 'Content Studio Manager', 'Drafts hooks, scripts, and content ideas.', 'waiting_approval', 'Waiting on content approval.', 'workhorse', 'Draft-only; publishing goes to Approval Court.', 'medium'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'sentinel', 'Sentinel', 'Approval Court Clerk', 'Holds risky actions for human review.', 'waiting_approval', 'Holding pending approvals.', 'none', 'Gatekeeper only; human-controlled decisions.', 'critical'),
  ('20000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'allocator', 'Allocator', 'Atlas Allocation Analyst', 'Explains paper-mode allocation output.', 'working', 'Running a mock paper review.', 'flagship', 'Display-only and paper mode; no live orders.', 'critical')
on conflict (id) do nothing;

update buildings set manager_agent_id = '20000000-0000-0000-0000-000000000001' where slug = 'keep-hall';
update buildings set manager_agent_id = '20000000-0000-0000-0000-000000000002' where slug = 'treasury';
update buildings set manager_agent_id = '20000000-0000-0000-0000-000000000003' where slug = 'content-studio';
update buildings set manager_agent_id = '20000000-0000-0000-0000-000000000004' where slug = 'approval-court';
update buildings set manager_agent_id = '20000000-0000-0000-0000-000000000005' where slug = 'allocation-tower';

insert into experiments (id, user_id, building_id, name, hypothesis, status, risk_level)
values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'AI productivity content funnel', 'Original operator content can feed template demand.', 'running', 'medium'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Atlas paper allocation', 'Paper allocation can become a decision-support view.', 'running', 'critical')
on conflict (id) do nothing;

insert into tasks (id, user_id, building_id, agent_id, title, status, summary, cost_estimate, expected_value)
values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', 'Draft 5 TikTok hooks for AI productivity content', 'waiting_approval', 'Drafts are ready for human review.', 0.08, 'Seed content-to-product funnel without auto-posting.'),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Calculate monthly AI spend', 'completed', 'AI spend is below budget.', 0, 'Keep cost risk visible.')
on conflict (id) do nothing;

insert into approvals (id, user_id, source_agent_id, building_id, title, status, summary, risk_level, side_effect_type, expected_benefit, estimated_cost, output_preview)
values (
  '50000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000003',
  '10000000-0000-0000-0000-000000000003',
  'Publish content draft',
  'pending',
  'Nova drafted a content post that must be reviewed before publishing.',
  'medium',
  'publish',
  'Tests a content lane for future product demand.',
  0,
  'Hook: Your AI stack is not the business. The operating loop is.'
)
on conflict (id) do nothing;

insert into treasury_records (user_id, cash_on_hand, revenue_mtd, expenses_mtd, ai_spend_mtd, hosting_spend_mtd, profit_mtd, approval_risk_exposure)
values ('00000000-0000-0000-0000-000000000001', 1240, 88, 31.39, 14.13, 12, 56.61, 2.84);

insert into atlas_allocation_records (user_id, params, weights, metrics, rationale, mode)
values (
  '00000000-0000-0000-0000-000000000001',
  '{"universe":["VTI","VXUS","BND","SGOV"]}'::jsonb,
  '{"VTI":0.55,"VXUS":0.25,"BND":0.15,"SGOV":0.05}'::jsonb,
  '{"mockSharpe":1.18,"maxDrawdown":-20.6}'::jsonb,
  'Paper-only sample allocation for display. No order is placed.',
  'paper'
);
