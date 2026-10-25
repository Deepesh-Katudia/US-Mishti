-- Per-request token usage and cost for the AI diamond concierge.
-- Visitors are stored only as a salted one-way hash, never as raw IPs.
create table if not exists public.chat_usage (
  id                 bigint generated always as identity primary key,
  visitor_hash       text not null,
  model              text not null,
  input_tokens       integer not null default 0,
  output_tokens      integer not null default 0,
  cache_read_tokens  integer not null default 0,
  cache_write_tokens integer not null default 0,
  cost_usd           numeric(12, 6) not null default 0,
  stop_reason        text,
  created_at         timestamptz not null default now()
);

create index if not exists chat_usage_created_at_idx on public.chat_usage (created_at desc);
create index if not exists chat_usage_visitor_day_idx on public.chat_usage (visitor_hash, created_at desc);

-- Service role only (written server-side by /api/chat).
alter table public.chat_usage enable row level security;

-- Handy daily cost view for the team (query from the Supabase SQL editor).
create or replace view public.chat_usage_daily
with (security_invoker = true) as
select
  date_trunc('day', created_at) as day,
  model,
  count(*)                         as requests,
  count(distinct visitor_hash)     as visitors,
  sum(input_tokens + output_tokens + cache_read_tokens + cache_write_tokens) as total_tokens,
  round(sum(cost_usd)::numeric, 4) as cost_usd
from public.chat_usage
group by 1, 2
order by 1 desc;
