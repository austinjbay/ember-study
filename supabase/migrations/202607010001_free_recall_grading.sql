create extension if not exists pgcrypto;

create table if not exists public.free_recall_answer_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_client_id text not null,
  pipeline_version text not null,
  passage_hash text not null,
  answer_key jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, chapter_client_id, pipeline_version)
);

create table if not exists public.free_recall_grades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_client_id text not null,
  answer_key_id uuid not null references public.free_recall_answer_keys(id) on delete cascade,
  pipeline_version text not null,
  user_response text not null,
  grading_result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.free_recall_answer_keys enable row level security;
alter table public.free_recall_grades enable row level security;

create policy "Users manage their own free recall answer keys"
on public.free_recall_answer_keys
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users manage their own free recall grades"
on public.free_recall_grades
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists free_recall_grades_user_chapter_idx
on public.free_recall_grades (user_id, chapter_client_id, created_at desc);
