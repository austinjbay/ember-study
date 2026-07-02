create table if not exists public.study_challenge_evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chapter_client_id text not null,
  free_recall_grade_id uuid references public.free_recall_grades(id) on delete set null,
  pipeline_version text not null,
  challenge_type text not null,
  prompt text not null,
  source_evidence text not null,
  user_response text not null,
  evaluation_result jsonb not null,
  overall_score integer not null,
  outcome text not null,
  rubric_scores jsonb not null,
  accuracy_score integer not null,
  created_at timestamptz not null default now(),
  constraint study_challenge_type_check check (
    challenge_type in (
      'central_claim',
      'supporting_idea',
      'relationship',
      'distortion',
      'unsupported_claim',
      'boundary_edge'
    )
  ),
  constraint study_challenge_outcome_check check (
    outcome in ('resolved', 'partially_resolved', 'needs_another_pass')
  ),
  constraint study_challenge_overall_score_range check (overall_score between 0 and 100),
  constraint study_challenge_accuracy_score_range check (accuracy_score between 0 and 2)
);

alter table public.study_challenge_evaluations enable row level security;

create policy "Users manage their own study challenge evaluations"
on public.study_challenge_evaluations
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists study_challenge_evaluations_user_chapter_idx
on public.study_challenge_evaluations (user_id, chapter_client_id, created_at desc);

create index if not exists study_challenge_evaluations_user_type_score_idx
on public.study_challenge_evaluations (user_id, challenge_type, overall_score desc, created_at desc);
