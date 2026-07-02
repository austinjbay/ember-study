alter table public.free_recall_grades
add column if not exists overall_score integer,
add column if not exists central_claim_score integer,
add column if not exists supporting_ideas_score integer,
add column if not exists accuracy_score integer;

update public.free_recall_grades
set
  overall_score = coalesce(overall_score, (grading_result ->> 'overall_score')::integer),
  central_claim_score = coalesce(central_claim_score, (grading_result ->> 'central_claim_score')::integer),
  supporting_ideas_score = coalesce(supporting_ideas_score, (grading_result ->> 'supporting_ideas_score')::integer),
  accuracy_score = coalesce(accuracy_score, (grading_result ->> 'accuracy_score')::integer)
where grading_result is not null
  and (
    overall_score is null
    or central_claim_score is null
    or supporting_ideas_score is null
    or accuracy_score is null
  );

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
  return new;
end;
$$;

drop trigger if exists set_free_recall_grade_score_columns on public.free_recall_grades;

create trigger set_free_recall_grade_score_columns
before insert or update of grading_result, overall_score, central_claim_score, supporting_ideas_score, accuracy_score
on public.free_recall_grades
for each row
execute function public.set_free_recall_grade_score_columns();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_overall_score_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_overall_score_range
    check (overall_score is null or overall_score between 0 and 100);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_central_claim_score_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_central_claim_score_range
    check (central_claim_score is null or central_claim_score between 0 and 4);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_supporting_ideas_score_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_supporting_ideas_score_range
    check (supporting_ideas_score is null or supporting_ideas_score between 0 and 4);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'free_recall_grades_accuracy_score_range'
      and conrelid = 'public.free_recall_grades'::regclass
  ) then
    alter table public.free_recall_grades
    add constraint free_recall_grades_accuracy_score_range
    check (accuracy_score is null or accuracy_score between 0 and 2);
  end if;
end $$;

create index if not exists free_recall_grades_user_score_idx
on public.free_recall_grades (user_id, overall_score desc, created_at desc);
