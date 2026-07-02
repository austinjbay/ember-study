# Recall Pattern Diagnosis Specs

Feature: Recall Pattern Diagnosis

Status: V1 prototype implemented locally

Pipeline version: `free-recall-v1.1`

Last updated: July 2, 2026

---

## Product spec

### Purpose

Recall Pattern Diagnosis turns free recall feedback into reusable reading coaching.

Free Recall Evaluation answers:

> Did the reader remember the meaning of this passage?

Recall Pattern Diagnosis answers:

> What kind of content does this reader tend to lose when they try to explain what they read?

This feature should help users notice repeatable recall patterns, not simply correct one answer.

### Primary user

Knowledge workers who read nonfiction to learn and apply ideas. They are not asking for summaries. They want to know whether they can remember, explain, and use what they read later.

### Core user job

After completing a chapter check, the user wants to understand:

> What did my answer miss, and what should I pay attention to the next time I read?

### Product principle

The product should avoid itemized “you forgot this fact” feedback as the main teaching moment.

Instead, it should abstract missed content into a pattern the user can use next time:

- “You tend to drop named examples.”
- “You remembered the point but missed the connective logic.”
- “You added something plausible that the source did not actually say.”
- “You missed the author’s boundary or qualification.”

The exact missed passage can still appear as evidence, but the coaching should focus on the reusable reading behavior.

### V1 user flow

1. User adds source material for a chapter.
2. User answers the free recall prompt.
3. Free Recall Evaluation grades meaning-based recall.
4. Recall Pattern Diagnosis compares the response against recall anchors from the answer key.
5. The feedback page shows:
   - what held;
   - what to look for next time, or where to go deeper next time;
   - a pattern to watch or practice;
   - source evidence that grounds the diagnosis;
   - the sequenced practice exercise.
6. The next practice exercise is chosen based on the strongest relevant pattern.
7. The diagnosis is saved so future product surfaces can show recurring recall tendencies.

### User-facing feedback behavior

If the user had a strong answer, the card title should be:

> Where to go deeper next time

If the user had a developing or weak answer, the card title should be:

> What to look for next time

The pattern section should use one of:

- Pattern to practice
- Pattern to watch

The card should not primarily list every missed fact. It should explain the type of thing the user missed.

The “Text evidence to revisit” quote should be derived from the active diagnosis pattern. If the pattern is about missing dates or timing, the quote should favor the passage sentence that contains the relevant date, era, sequence, or duration. If the pattern is about names or entities, the quote should favor the passage sentence containing the named person, group, place, or institution. The quote should ground the coaching pattern in the current chapter.

Each pattern should also show a small editing example:

- what the user wrote;
- what they could add next time.

The suggested addition should use an editing color so it reads as a constructive revision, not another mistake label.

### V1 pattern taxonomy

| Pattern | User-facing meaning | Example coaching |
|---|---|---|
| `claim_loss` | You remembered the topic, but not the author’s point. | “Before listing details, ask: what is the author trying to get me to believe?” |
| `entity_loss` | You left out important names, people, groups, places, institutions, or named examples. | “Names are often the handles that make an argument easier to explain later.” |
| `temporal_loss` | You left out dates, eras, sequences, durations, or historical timing. | “Time markers often explain why an example matters, not just when it happened.” |
| `evidence_loss` | You missed concrete examples, cases, studies, anecdotes, or details. | “Keep one concrete example attached to the main idea.” |
| `relationship_loss` | You remembered ideas separately, but not how they connect. | “Look for cause, contrast, dependency, reinforcement, or tension.” |
| `qualification_loss` | You missed limits, exceptions, boundaries, or narrowing language. | “Small words like but, not, only, despite, or however can change the claim.” |
| `distortion_or_unsupported_addition` | You added a plausible idea that the source did not support. | “Separate what the passage says from what feels inferred.” |

### Success criteria

V1 succeeds if:

- a graded free recall response returns a structured recall pattern diagnosis;
- the feedback page shows pattern-based coaching instead of only missed facts;
- each diagnosis is grounded in missed, distorted, or unsupported content;
- the diagnosis is saved with the grading result;
- the primary pattern can be queried later for dashboarding or sequencing;
- the next practice exercise can use the diagnosis to feel personalized.

### Non-goals for V1

- Do not build a full longitudinal learner model yet.
- Do not show users a complex diagnostic dashboard yet.
- Do not over-explain the taxonomy in the main feedback flow.
- Do not make users feel like they are being graded on memorizing trivia.
- Do not replace free recall scoring. This is a second layer, not a replacement.

---

## Engineering spec

### Current implementation summary

Recall Pattern Diagnosis has been added to the free recall grading pipeline.

The shared schema lives in:

- `supabase/functions/_shared/free-recall.ts`

The browser feedback rendering lives in:

- `app.js`

The Edge Function write path lives in:

- `supabase/functions/grade-free-recall/index.ts`

The new migration lives in:

- `supabase/migrations/202607010005_recall_pattern_diagnosis.sql`

### Pipeline version

Current version:

```ts
export const PIPELINE_VERSION = "free-recall-v1.1";
```

The version was bumped from `free-recall-v1` because the answer key schema now includes `recall_anchors`.

This prevents the Edge Function from reusing older answer keys that do not include the new anchor fields.

### Answer key generation

The answer key model call now returns:

- `central_claim`
- `supporting_ideas`
- `common_misreadings`
- `recall_anchors`

`recall_anchors` are structured content anchors used to diagnose what kind of content the user lost.

Supported anchor types:

```ts
claim
entity
temporal
evidence
relationship
qualification
```

Each anchor includes:

```json
{
  "id": "anchor-entity-1",
  "type": "entity",
  "text": "George Eliot and George Lewes",
  "why_it_matters": "They are the named example that carries the chapter's idea about love and character."
}
```

### Grading output

The grading model call now returns `recall_pattern_diagnosis` in addition to the existing free recall grading fields.

Each diagnosis item includes:

```json
{
  "pattern": "entity_loss",
  "severity": 0.75,
  "evidence": ["The response did not mention George Eliot or George Lewes."],
  "coaching": "Notice the named people, places, or groups the author uses to carry the idea. Names are often the handles that make an argument easier to explain later.",
  "recommended_practice_type": "entity_recall"
}
```

### Zod validation

The shared schema validates:

- answer key shape;
- anchor type enum;
- grading result shape;
- recall pattern enum;
- diagnosis severity between 0 and 1;
- diagnosis evidence length;
- max three diagnosis items.

The Edge Function should reject invalid model output before saving.

### Prompting requirements

The grading prompt instructs the model to:

- grade meaning-based recall only;
- avoid scoring writing quality;
- compare the user response against `answer_key.recall_anchors`;
- diagnose the type of content lost, not merely the exact missed fact;
- return only diagnosis items supported by missed, distorted, or unsupported content;
- include at most one low-severity practice pattern for strong answers.

### Browser behavior

The UI uses `formalRecallPatternFeedback()` to prefer `grading_result.recall_pattern_diagnosis`.

If formal diagnosis is unavailable, the app falls back to the local heuristic classifier from missed feedback text.

This fallback allows the prototype to keep working before the updated Edge Function has been deployed.

The UI also derives `Text evidence to revisit` from the selected pattern by scoring passage sentences against diagnosis evidence and answer-key anchors. This keeps the quote aligned with the feedback pattern rather than showing a generic missed-support sentence.

### Sequencing behavior

V1 stores `recommended_practice_type` but does not yet fully route every type to a distinct custom exercise.

Recommended next step:

Map diagnosis patterns to stable study challenge types:

| Pattern | Suggested practice |
|---|---|
| `claim_loss` | central claim rebuild |
| `entity_loss` | named example recall |
| `temporal_loss` | timing significance |
| `evidence_loss` | attach evidence to claim |
| `relationship_loss` | explain the connection |
| `qualification_loss` | find the boundary |
| `distortion_or_unsupported_addition` | source vs inference |

### Testing

Updated test fixture:

- `supabase/functions/grade-free-recall/free-recall.test.ts`

The test data now includes:

- `recall_anchors` in the answer key;
- `recall_pattern_diagnosis` in strong, vague, and hallucinated grading cases.

Known local limitation:

- `deno` is not installed in the current local shell, so Edge Function tests could not be executed locally.
- `node --check app.js` passed.

### Deployment steps

When ready to deploy:

1. Push the new migration.
2. Deploy `grade-free-recall`.
3. Submit a new chapter check.
4. Confirm the returned `grading_result` includes `recall_pattern_diagnosis`.
5. Confirm `free_recall_grades` stores:
   - `recall_pattern_diagnosis`;
   - `primary_recall_pattern`;
   - `primary_recall_pattern_severity`.

---

## Data spec

### Data ownership

Recall Pattern Diagnosis data is scoped to the Supabase auth user through the existing `free_recall_grades.user_id`.

Row Level Security continues to apply through the existing `free_recall_grades` table policies.

### Existing table updated

Table:

```sql
public.free_recall_grades
```

New columns:

```sql
recall_pattern_diagnosis jsonb
primary_recall_pattern text
primary_recall_pattern_severity numeric(5,4)
```

### Column purposes

`recall_pattern_diagnosis`

Stores the full structured diagnosis array returned by the grading pipeline.

`primary_recall_pattern`

Stores the top diagnosis pattern for faster querying and future dashboarding.

`primary_recall_pattern_severity`

Stores the severity of the top diagnosis pattern, normalized from 0 to 1.

### Constraints

`primary_recall_pattern` must be null or one of:

```text
claim_loss
entity_loss
temporal_loss
evidence_loss
relationship_loss
qualification_loss
distortion_or_unsupported_addition
```

`primary_recall_pattern_severity` must be null or between 0 and 1.

### Indexes

New index:

```sql
free_recall_grades_user_pattern_idx
on public.free_recall_grades (user_id, primary_recall_pattern, created_at desc)
```

This supports future queries like:

- most common recall pattern for a user;
- recent instances of a specific recall pattern;
- pattern trends over time.

### Trigger behavior

The existing `set_free_recall_grade_score_columns()` trigger has been replaced to also hydrate recall pattern columns from `grading_result`.

On insert or update, the trigger fills:

- existing numeric score columns;
- existing normalized score columns;
- `recall_pattern_diagnosis`;
- `primary_recall_pattern`;
- `primary_recall_pattern_severity`.

### Answer key JSON schema

Stored in:

```sql
public.free_recall_answer_keys.answer_key
```

New required field:

```json
{
  "recall_anchors": [
    {
      "id": "string",
      "type": "claim | entity | temporal | evidence | relationship | qualification",
      "text": "string",
      "why_it_matters": "string"
    }
  ]
}
```

### Grading result JSON schema

Stored in:

```sql
public.free_recall_grades.grading_result
```

New required field:

```json
{
  "recall_pattern_diagnosis": [
    {
      "pattern": "claim_loss | entity_loss | temporal_loss | evidence_loss | relationship_loss | qualification_loss | distortion_or_unsupported_addition",
      "severity": 0.75,
      "evidence": ["string"],
      "coaching": "string",
      "recommended_practice_type": "string"
    }
  ]
}
```

### Example row-level diagnosis

```json
[
  {
    "pattern": "entity_loss",
    "severity": 0.75,
    "evidence": ["The response did not mention George Eliot or George Lewes."],
    "coaching": "Notice the named people, places, or groups the author uses to carry the idea. Names are often the handles that make an argument easier to explain later.",
    "recommended_practice_type": "entity_recall"
  },
  {
    "pattern": "qualification_loss",
    "severity": 0.55,
    "evidence": ["The response missed that love alone is not enough."],
    "coaching": "Pay attention to the author's exact limits and contrasts. Small words like not, but, alone, or however can change what the idea means.",
    "recommended_practice_type": "qualification_boundary"
  }
]
```

### Future data products

This data model enables:

- user-level recall pattern dashboards;
- book-level pattern summaries;
- sequencing practice based on recurring weaknesses;
- “you often drop named examples” coaching;
- longitudinal measurement of whether a pattern improves;
- onboarding personalization based on known reading habits.

### Known V1 limitations

- Older `free-recall-v1` rows may not include recall pattern diagnosis.
- The browser has a heuristic fallback, but formal diagnosis requires the updated Edge Function.
- Recommended practice types are stored but not yet fully mapped to unique practice UIs.
- Broader book and chapter metadata still primarily lives in browser localStorage in the prototype.
