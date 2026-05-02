create table if not exists public.models (
  id text primary key,
  name text not null,
  provider text not null,
  capabilities text[] not null default '{}',
  price_per_1k_tokens double precision not null,
  context_window integer not null,
  latency double precision not null,
  documentation_url text not null,
  created_at timestamptz not null default now()
);
