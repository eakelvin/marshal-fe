-- Knowledge items (saved URLs + AI enrichment fields)
-- Run in Supabase → SQL Editor after auth is working.

create table if not exists public.knowledge_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  url text not null,
  title text not null default '',
  source text not null default 'article',
  notes text,
  author text not null default '',
  summary text not null default '',
  takeaways text[] not null default '{}',
  quotes text[] not null default '{}',
  tags text[] not null default '{}',
  topics text[] not null default '{}',
  difficulty text not null default 'intermediate',
  reading_time integer not null default 0,
  why_it_matters text not null default '',
  connections uuid[] not null default '{}',
  suggested_next uuid,
  image text,
  collection_ids uuid[] not null default '{}',
  processed boolean not null default false,
  status text not null default 'queued'
    check (status in ('queued', 'processing', 'ready', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_items_user_id_created_at_idx
  on public.knowledge_items (user_id, created_at desc);

alter table public.knowledge_items enable row level security;

drop policy if exists "Users can read own knowledge items" on public.knowledge_items;
drop policy if exists "Users can insert own knowledge items" on public.knowledge_items;
drop policy if exists "Users can update own knowledge items" on public.knowledge_items;
drop policy if exists "Users can delete own knowledge items" on public.knowledge_items;

create policy "Users can read own knowledge items"
  on public.knowledge_items
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own knowledge items"
  on public.knowledge_items
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own knowledge items"
  on public.knowledge_items
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own knowledge items"
  on public.knowledge_items
  for delete
  to authenticated
  using (auth.uid() = user_id);
