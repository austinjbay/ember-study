alter table public.free_recall_grades
add column if not exists overall_score_normalized numeric(5,4),
add column if not exists central_claim_score_normalized numeric(5,4),
add column if not exists supporting_ideas_score_normalized numeric(5,4),
add column if not exists accuracy_score_normalized numeric(5,4);

update public.free_recall_grades
set
  overall_score_normalized = round(coalesce(overall_score, (grading_result ->> 'overall_score')::integer)::numeric / 100, 4),
  central_claim_score_normalized = round(coalesce(central_claim_score, (grading_result ->> 'central_claim_score')::integer)::numeric / 4, 4),
  supporting_ideas_score_normalized = round(coalesce(supporting_ideas_score, (grading_result ->> 'supporting_ideas_score')::integer)::numeric / 4, 4),
  accuracy_score_normalized = round(coalesce(accuracy_score, (grading_result ->> 'accuracy_score')::integer)::numeric / 2, 4)
where grading_result is not null;

create or replace function public.set_free_recall_grade_score_columns()
returns trigger
language plpgsql
as $$
begin
  if new.grading_result is not null then
    new.overall_score = coalesce(new.overall_score, (new.grading_result ->> 'overall_score')::integer);
    new.central_claim_score = coalesce(new.central_claim_score, (new.grading_result ->> 'central_claim_score')::integer);
    new.supporting_ideas_score = coalesce(new.supporting_ideas_score, (new.grading_result ->> 'supporting_ideas_score')::integer);
    new.accuracy_score = coalesce(new.accuracy_score, (new.grading_result ->> 'accuracy_score')::integer);
  end if;

  if new.overall_score is not null then
    new.overall_score_normalized = round(new.overall_score::numeric / 100, 4);
  end if;
  if new.central_claim_score is not null then
    new.central_claim_score_normalized = round(new.central_claim_score::numeric / 4, 4);
  end if;
  if new.supporting_ideas_score is not null then
    new.supporting_ideas_score_normalized = round(new.supporting_ideas_score::numeric / 4, 4);
  end if;
  if new.accuracy_score is not null then
    new.accuracy_score_normalized = round(new.accuracy_score::numeric / 2, 4);
  end if;

  return new;
end;
$$;

create or replace function public.normalize_study_challenge_rubric_scores(scores jsonb)
returns jsonb
language sql
immutable
as $$
  select coalesce(
    jsonb_agg(
      item || jsonb_build_object(
        'score_normalized',
        round(((item ->> 'score')::numeric / 4), 4)
      )
      order by ordinality
    ),
    '[]'::jsonb
  )
  from jsonb_array_elements(coalesce(scores, '[]'::jsonb)) with ordinality as rubric(item, ordinality);
$$;

alter table public.study_challenge_evaluations
add column if not exists overall_score_normalized numeric(5,4),
add column if not exists accuracy_score_normalized numeric(5,4),
add column if not exists rubric_scores_normalized jsonb;

update public.study_challenge_evaluations
set
  overall_score_normalized = round(overall_score::numeric / 100, 4),
  accuracy_score_normalized = round(accuracy_score::numeric / 2, 4),
  rubric_scores_normalized = public.normalize_study_challenge_rubric_scores(rubric_scores)
where
  overall_score_normalized is null
  or accuracy_score_normalized is null
  or rubric_scores_normalized is null;

create or replace function public.set_study_challenge_normalized_score_columns()
returns trigger
language plpgsql
as $$
begin
  if new.overall_score is not null then
    new.overall_score_normalized = round(new.overall_score::numeric / 100, 4);
  end if;
  if new.accuracy_score is not null then
    new.accuracy_score_normalized = round(new.accuracy_score::numeric / 2, 4);
  end if;
  if new.rubric_scores is not null then
    new.rubric_scores_normalized = public.normalize_study_challenge_rubric_scores(new.rubric_scores);
  end if;
  return new;
end;
$$;

drop trigger if exists set_study_challenge_normalized_score_columns on public.study_challenge_evaluations;

create trigger set_study_challenge_normalized_score_columns
before insert or update of overall_score, accuracy_score, rubric_scores, overall_score_normalized, accuracy_score_normalized, rubric_scores_normalized
on public.study_challenge_evaluations
for each row
execute function public.set_study_challenge_normalized_score_columns();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_overall_score_normalized_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_overall_score_normalized_range
    check (overall_score_normalized is null or overall_score_normalized between 0 and 1);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_central_claim_score_normalized_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_central_claim_score_normalized_range
    check (central_claim_score_normalized is null or central_claim_score_normalized between 0 and 1);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_supporting_ideas_score_normalized_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_supporting_ideas_score_normalized_range
    check (supporting_ideas_score_normalized is null or supporting_ideas_score_normalized between 0 and 1);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_accuracy_score_normalized_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_accuracy_score_normalized_range
    check (accuracy_score_normalized is null or accuracy_score_normalized between 0 and 1);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'study_challenge_overall_score_normalized_range'
      and conrelid = 'public.study_challenge_evaluations'::regclass
  ) then
    alter table public.study_challenge_evaluations
    add constraint study_challenge_overall_score_normalized_range
    check (overall_score_normalized is null or overall_score_normalized between 0 and 1);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'study_challenge_accuracy_score_normalized_range'
      and conrelid = 'public.study_challenge_evaluations'::regclass
  ) then
    alter table public.study_challenge_evaluations
    add constraint study_challenge_accuracy_score_normalized_range
    check (accuracy_score_normalized is null or accuracy_score_normalized between 0 and 1);
  end if;
end $$;

create index if not exists free_recall_grades_user_normalized_score_idx
on public.free_recall_grades (user_id, overall_score_normalized desc, created_at desc);

create index if not exists study_challenge_evaluations_user_type_normalized_score_idx
on public.study_challenge_evaluations (user_id, challenge_type, overall_score_normalized desc, created_at desc);
