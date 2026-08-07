-- Add Twitter / X link to profiles (safe if 004 already ran)
alter table public.profiles
  add column if not exists twitter text not null default '';

comment on column public.profiles.twitter is
  'X / Twitter profile URL or username';
