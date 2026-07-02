alter table public.free_recall_grades
add column if not exists recall_pattern_diagnosis jsonb,
add column if not exists primary_recall_pattern text,
add column if not exists primary_recall_pattern_severity numeric(5,4);

update public.free_recall_grades
set
  recall_pattern_diagnosis = coalesce(recall_pattern_diagnosis, grading_result -> 'recall_pattern_diagnosis'),
  primary_recall_pattern = coalesce(primary_recall_pattern, grading_result #>> '{recall_pattern_diagnosis,0,pattern}'),
  primary_recall_pattern_severity = coalesce(primary_recall_pattern_severity, nullif(grading_result #>> '{recall_pattern_diagnosis,0,severity}', '')::numeric)
where grading_result ? 'recall_pattern_diagnosis';

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
    new.recall_pattern_diagnosis = coalesce(new.recall_pattern_diagnosis, new.grading_result -> 'recall_pattern_diagnosis');
    new.primary_recall_pattern = coalesce(new.primary_recall_pattern, new.grading_result #>> '{recall_pattern_diagnosis,0,pattern}');
    new.primary_recall_pattern_severity = coalesce(new.primary_recall_pattern_severity, nullif(new.grading_result #>> '{recall_pattern_diagnosis,0,severity}', '')::numeric);
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

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'free_recall_grades_primary_recall_pattern_check'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_primary_recall_pattern_check
    check (
      primary_recall_pattern is null
      or primary_recall_pattern in (
        'claim_loss',
        'entity_loss',
        'temporal_loss',
        'evidence_loss',
        'relationship_loss',
        'qualification_loss',
        'distortion_or_unsupported_addition'
      )
    );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'free_recall_grades_primary_recall_pattern_severity_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_primary_recall_pattern_severity_range
    check (primary_recall_pattern_severity is null or primary_recall_pattern_severity between 0 and 1);
  end if;
end $$;

create index if not exists free_recall_grades_user_pattern_idx
on public.free_recall_grades (user_id, primary_recall_pattern, created_at desc);
