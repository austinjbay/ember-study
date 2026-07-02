# Study Challenge Rubrics

Feature: Study Challenge Evaluation

Purpose
Study challenges extend Free Recall by evaluating the specific follow-up task the user receives after the initial recall check. Each challenge type has a stable rubric so performance can be tracked over time by skill, not merely by chapter.

Learning principles used

- Retrieval practice: asking the user to reconstruct meaning from memory.
- Elaborative retrieval: asking for reasons, examples, mechanisms, and support.
- Self-explanation: asking how ideas relate, depend on, qualify, or cause one another.
- Corrective feedback: helping the user repair distorted or incomplete recall.
- Source monitoring: separating what the passage actually said from plausible but unsupported additions.
- Transfer and critical evaluation: asking strong users to test assumptions, boundaries, and application limits.

Scoring model

Each challenge returns:

- challenge_type
- outcome: resolved, partially_resolved, or needs_another_pass
- overall_score: 0–100
- accuracy_score: 0–2
- rubric_scores: three dimensions, each scored 0–4
- feedback:
  - what_worked
  - what_to_strengthen
  - what_to_try_next

The server recomputes the overall score from the rubric scores and accuracy score. Writing quality, grammar, tone, vocabulary, and answer length are not grading criteria.

## 1. Central claim challenge

Used when the user remembers the topic but not the argument.

Question job: “What does the author want the reader to believe?”

Rubric dimensions:

- Claim precision: identifies the central claim as an arguable proposition.
- Scope control: keeps the claim at the right level of breadth.
- Meaning fidelity: preserves the passage’s meaning in the user’s own words.

## 2. Supporting idea challenge

Used when the user gets the main claim but misses the support.

Question job: “Which reasons, examples, evidence, or mechanisms made the claim work?”

Rubric dimensions:

- Support relevance: names support that directly helps explain, justify, or qualify the claim.
- Support completeness: recovers enough of the idea for it to be useful later.
- Evidence fidelity: keeps the support consistent with the passage.

## 3. Relationship challenge

Used when the user remembers ideas but not how they connect.

Question job: “How does this idea support, qualify, contrast with, or depend on another idea?”

Rubric dimensions:

- Relationship type: correctly names the relationship between ideas.
- Logical link: explains the because/therefore/whereas logic.
- Transferable explanation: explains the relationship in a way the user can reuse later.

## 4. Distortion challenge

Used when the user recalls an idea but materially changes its meaning.

Question job: “Rewrite the idea so it stays faithful to the passage.”

Rubric dimensions:

- Error identification: identifies what was misstated or overclaimed.
- Corrected meaning: restates the idea with the needed qualification.
- Source alignment: grounds the correction in the passage.

## 5. Unsupported claim challenge

Used when the user adds plausible but unsupported information.

Question job: “Which part of your answer goes beyond what the passage actually said?”

Rubric dimensions:

- Unsupported detection: identifies the substantive unsupported claim.
- Boundary setting: separates supported source content from inference.
- Source-faithful revision: rewrites the answer to remove unsupported content.

## 6. Boundary / edge challenge

Used when the user’s Free Recall response is strong.

Question job: “What assumption or boundary would make the argument less convincing?”

Rubric dimensions:

- Assumption or boundary: identifies a real condition, dependency, or limit.
- Argument impact: explains how the argument weakens, narrows, or changes.
- Fairness to source: challenges the argument without caricaturing it.

V1 data behavior

Study challenge evaluations are saved in `study_challenge_evaluations`, scoped to the Supabase auth user. The table stores the challenge type, prompt, source evidence, user response, full evaluation JSON, rubric scores, overall score, outcome, and accuracy score.
