-- Phase B: Collector stores extracted page content on knowledge_items
-- Run in Supabase → SQL Editor after 002_knowledge_items.sql

alter table public.knowledge_items
  add column if not exists content_text text,
  add column if not exists description text,
  add column if not exists fetch_error text;

-- Allow "collected" = content fetched, awaiting Summarizer (Phase C)
alter table public.knowledge_items
  drop constraint if exists knowledge_items_status_check;

alter table public.knowledge_items
  add constraint knowledge_items_status_check
  check (status in ('queued', 'processing', 'collected', 'ready', 'failed'));

comment on column public.knowledge_items.content_text is
  'Main extracted text from Collector (Phase B); input for Summarizer (Phase C)';
comment on column public.knowledge_items.description is
  'Short description / og:description from the source page';
comment on column public.knowledge_items.fetch_error is
  'Last Collector failure message, if status = failed';
