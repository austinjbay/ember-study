# Recall Pattern Diagnosis

## Purpose

Recall Pattern Diagnosis is the second layer of the free recall system.

Free Recall Evaluation answers: did the reader recover the meaning of the passage?

Recall Pattern Diagnosis answers: what kind of content does the reader tend to lose when explaining what they read?

The goal is not to shame missed facts. The goal is to turn missed content into reusable coaching.

## V1 pattern taxonomy

| Pattern | What it detects | Coaching intent |
|---|---|---|
| `claim_loss` | The user remembers the topic but not the author’s actual point. | Help the user separate “what this is about” from “what the author wants me to believe.” |
| `entity_loss` | The user omits important names, people, groups, places, institutions, or named examples. | Help the user notice the concrete actors that carry an argument. |
| `temporal_loss` | The user omits dates, eras, sequences, durations, or historical timing. | Help the user notice when time explains why an example matters. |
| `evidence_loss` | The user misses examples, studies, cases, anecdotes, or concrete supporting details. | Help the user keep at least one example attached to the main idea. |
| `relationship_loss` | The user names ideas but misses cause, contrast, dependency, reinforcement, or tension. | Help the user recall how the ideas connect. |
| `qualification_loss` | The user misses limits, exceptions, boundaries, contrasts, or narrowing language. | Help the user preserve the author’s precise meaning. |
| `distortion_or_unsupported_addition` | The user adds a plausible idea that is absent from or contradicted by the passage. | Help the user separate source-supported recall from inference. |

## Answer key additions

The free recall answer key now includes `recall_anchors`.

Each anchor has:

- `id`
- `type`: `claim`, `entity`, `temporal`, `evidence`, `relationship`, or `qualification`
- `text`
- `why_it_matters`

These anchors identify the specific kinds of content a reader may need to preserve in memory to explain the passage well.

## Grading result additions

The grading result now includes `recall_pattern_diagnosis`.

Each diagnosis has:

- `pattern`
- `severity`: normalized 0 to 1
- `evidence`: concrete missed, distorted, or unsupported content from this attempt
- `coaching`: user-facing guidance
- `recommended_practice_type`: the next practice activity this pattern should sequence into

## Product behavior

On the feedback page, the “What to look for next time” card should show the pattern, not a list of exact missed facts.

For example:

> names and entities: Notice the named people, places, or groups the author uses to carry the idea. Names are often the handles that make an argument easier to explain later.

The exact passage quote can still appear below as evidence, but the main teaching moment is the pattern.

## Storage

V1 stores the full diagnosis in `free_recall_grades.recall_pattern_diagnosis`.

It also stores:

- `primary_recall_pattern`
- `primary_recall_pattern_severity`

These columns make future dashboards and sequencing logic easier, for example:

> You often remember the main idea, but drop named examples and qualifying language.

## Pipeline version

Current version: `free-recall-v1.1`

The version was bumped because the answer key schema now includes recall anchors.
