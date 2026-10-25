-- Inquiries captured from the US Mishti marketing site.
create table if not exists public.inquiries (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('trade', 'retail')),
  name        text not null check (char_length(name) between 2 and 120),
  email       text not null check (char_length(email) <= 200),
  phone       text check (char_length(phone) <= 40),
  company     text check (char_length(company) <= 160),
  interest    text not null,
  message     text not null check (char_length(message) between 10 and 2000),
  status      text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at  timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_kind_status_idx on public.inquiries (kind, status);

-- RLS on with no policies: anon/authenticated roles have no access.
-- Only the service role (used server-side by the Next.js Server Action) can read/write.
alter table public.inquiries enable row level security;
