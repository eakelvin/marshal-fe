-- Survey responses (anonymous product research)
-- Run once in Supabase → SQL Editor.

create table if not exists public.surveys (
  id uuid primary key default gen_random_uuid(),
  save_where text[] not null,
  after_save text not null,
  revisit text not null,
  frustration text not null,
  would_pay text not null,
  created_at timestamptz not null default now()
);

alter table public.surveys enable row level security;

drop policy if exists "Anyone can insert survey responses" on public.surveys;

create policy "Anyone can insert survey responses"
  on public.surveys
  for insert
  to anon, authenticated
  with check (true);

-- No SELECT policy for anon/authenticated → responses stay private
-- (view rows in Table Editor as project owner / service role)
