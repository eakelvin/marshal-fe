-- User profiles (account details editable in Settings)
-- Run in Supabase → SQL Editor after auth is working.
-- Email stays on auth.users; this table holds display / contact fields.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default '',
  first_name text not null default '',
  last_name text not null default '',
  occupation text not null default '',
  domain text not null default '',
  linkedin text not null default '',
  github text not null default '',
  twitter text not null default '',
  birthday date,
  phone text not null default '',
  address text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'App profile fields for Settings → Account (auth.users holds email/credentials)';
comment on column public.profiles.birthday is
  'Optional birth date (YYYY-MM-DD)';

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can delete own profile" on public.profiles;

create policy "Users can read own profile"
  on public.profiles
  for select
  to authenticated
  using ( (select auth.uid()) = id );

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check ( (select auth.uid()) = id );

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

create policy "Users can delete own profile"
  on public.profiles
  for delete
  to authenticated
  using ( (select auth.uid()) = id );

-- Auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  first_name text := coalesce(meta ->> 'first_name', meta ->> 'given_name', '');
  last_name text := coalesce(meta ->> 'last_name', meta ->> 'family_name', '');
  full_name text := coalesce(meta ->> 'full_name', meta ->> 'name', '');
begin
  if full_name = '' then
    full_name := trim(both from first_name || ' ' || last_name);
  end if;

  if first_name = '' and full_name <> '' then
    first_name := split_part(full_name, ' ', 1);
    if position(' ' in full_name) > 0 then
      last_name := substr(full_name, position(' ' in full_name) + 1);
    end if;
  end if;

  insert into public.profiles (
    id,
    display_name,
    first_name,
    last_name,
    occupation,
    avatar_url
  )
  values (
    new.id,
    full_name,
    first_name,
    last_name,
    coalesce(meta ->> 'occupation', ''),
    coalesce(meta ->> 'avatar_url', meta ->> 'picture')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users who already exist
insert into public.profiles (id, display_name, first_name, last_name, occupation, avatar_url)
select
  u.id,
  coalesce(
    nullif(trim(both from coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name', '')), ''),
    trim(both from coalesce(u.raw_user_meta_data ->> 'first_name', '') || ' ' || coalesce(u.raw_user_meta_data ->> 'last_name', '')),
    split_part(coalesce(u.email, 'user'), '@', 1)
  ),
  coalesce(u.raw_user_meta_data ->> 'first_name', u.raw_user_meta_data ->> 'given_name', ''),
  coalesce(u.raw_user_meta_data ->> 'last_name', u.raw_user_meta_data ->> 'family_name', ''),
  coalesce(u.raw_user_meta_data ->> 'occupation', ''),
  coalesce(u.raw_user_meta_data ->> 'avatar_url', u.raw_user_meta_data ->> 'picture')
from auth.users u
on conflict (id) do nothing;
