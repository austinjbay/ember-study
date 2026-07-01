# Adaptive Review Question Framework

## Purpose

Delayed reviews should test whether understanding lasts—not whether a reader remembers the wording of a familiar question.

The experience therefore keeps a consistent structure while varying the prompt:

1. Revisit the most useful gap from the original chapter check.
2. Recover the chapter’s central claim.
3. Occasionally apply, distinguish, or challenge an idea once recall is strong.

The complete review should take approximately two to three minutes.

## Product principles

- **Predictable structure, varied prompts.** Readers should understand what kind of thinking is expected without memorizing the test.
- **Generation before recognition.** Ask readers to produce an answer before showing choices, hints, prior responses, or source material.
- **One cognitive job per question.** Avoid prompts that simultaneously ask for the claim, evidence, application, and critique.
- **The weaker signal wins.** Schedule the next review using the weaker result across the targeted gap and central claim.
- **Difficulty should feel earned.** Application and challenge prompts follow demonstrated recall; they do not replace foundational retrieval.
- **Feedback remains explainable.** Show what was tested, what the response demonstrated, and why the idea will return.

## Core review sequence

### Step 1: Revisit the previous gap

Generate a focused question from the gap identified during the initial check.

Do not reveal the original response, feedback explanation, or source excerpt before the attempt.

### Step 2: Test the central claim

Ask the reader to reconstruct the main argument separately:

> In one or two sentences, what is this chapter’s central claim?

This prevents success on one narrow detail from being treated as overall chapter understanding.

### Step 3: Show separate results

| Memory signal | Possible result |
| --- | --- |
| Previous gap | Recovered / Partly retained / Still missing |
| Central claim | Strong / Developing / Needs another pass |
| Next review | 3 days / 1 week / 2 weeks / Retired |

## Prompt library by gap type

### Insufficient response

Use when the original response did not contain enough information to evaluate.

1. What did the author most want the reader to believe?
2. Explain the chapter’s main point in one or two sentences.
3. If you could preserve only one idea from this chapter, what would it be and why?

### Missed central claim

Use when the reader recalled the topic but not the author’s argument.

1. State the chapter’s central claim and the strongest reason the author gives for it.
2. What is the author arguing—not merely describing?
3. Complete this thought in your own words: “The author wants the reader to see that…”

### Weak relationship between ideas

Use when relevant ideas were present but their relationship was implicit.

1. How do the chapter’s two main ideas depend on or reinforce one another?
2. Why does one of these ideas lead to the other?
3. What connection between these ideas is essential to the author’s argument?

### Missed supporting evidence

Use when the central direction was present but an important reason, example, or mechanism was absent.

1. What example or reason best supports the chapter’s central claim?
2. Why does the author believe this claim is true?
3. What evidence from the chapter would you use to explain this idea to someone skeptical?

### Strong initial recall

Use when the reader already demonstrated reliable foundational understanding.

1. Where might the chapter’s argument stop being useful or true?
2. What real situation would test this idea?
3. What assumption does the argument depend on?

## Adaptation rules

| Previous result | Next prompt type | Scheduling direction |
| --- | --- | --- |
| Still missing | Focused explanation using the same idea from a new angle | Return sooner |
| Partly retained | Relationship or evidence question | Standard interval |
| Recovered | Central claim plus light application | Extend interval |
| Repeatedly strong | Application, distinction, or challenge | Extend significantly or retire |

### Recommended V1 selection logic

1. Identify the saved `gapType`.
2. Select from that gap type’s three prompt variants.
3. Avoid the prompt used in the most recent review.
4. Choose the variant using the previous review result:
   - weak result → variant 1;
   - partial result → variant 2;
   - strong result → variant 3.
5. Always follow with a central-claim question.

This is deterministic enough to test and explain while still creating meaningful variety.

## Evaluation behavior

Evaluate the two answers independently.

### Previous gap

Compare the response with the source passage associated with the original gap. Determine whether the missing idea or relationship is now explicit.

### Central claim

Compare the response with the chapter source as a whole. Prioritize:

- accuracy of the main claim;
- inclusion of a meaningful supporting reason;
- absence of a consequential misconception.

### Confidence

Collect confidence after each answer. Keep it separate from answer quality so readers can compare perceived and demonstrated understanding over time.

## Feedback pattern

Use concise, evidence-grounded language:

> You recovered the connection between concentration and learning difficult skills. The central claim was mostly intact, but the role of high-quality output was still unclear.

Then explain the consequence:

> This idea will return in three days because the central claim was weaker than the targeted gap.

Avoid presenting a single score that combines both answers.

## Repeated difficulty

After two unsuccessful attempts on the same idea:

1. Show the relevant source excerpt.
2. Ask the reader to explain it in their own words.
3. Save that explanation as the new comparison point.
4. Schedule a shorter follow-up.

The experience should feel like useful scaffolding, not failure.

## Suggested data model

```js
{
  promptType: "relationship",
  promptVariant: 2,
  gapType: "Weak relationship between ideas",
  gapResponse: "...",
  gapConfidence: "Mostly",
  gapResult: "Partly retained",
  centralClaimResponse: "...",
  centralClaimConfidence: "Partly",
  centralClaimResult: "Developing",
  nextReviewAt: "2026-07-08T17:00:00.000Z",
  createdAt: "2026-07-01T17:00:00.000Z"
}
```

## V1 scope

Include:

- two-question review structure;
- three variants per gap type;
- deterministic prompt selection;
- independent results;
- confidence after each answer;
- scheduling based on the weaker result;
- source-supported recovery after repeated difficulty.

Defer:

- open-ended AI-generated prompt creation;
- large question banks;
- cross-book questions;
- concept graphs;
- social comparison;
- points, streaks, and awards.

## Acceptance criteria

- A review never presents the same targeted prompt twice consecutively.
- Every review contains one targeted-gap question and one central-claim question.
- Prior answers and source material remain hidden until both first attempts are submitted.
- Each answer receives its own result and confidence record.
- The next interval is based on the weaker of the two results.
- Existing review history remains readable.
- A reader can edit either response after submission.
- Two repeated misses trigger source-supported scaffolding.
- Review completion remains possible in under three minutes during usability testing.

## Research questions

- Do readers understand why they received each question?
- Does variation make reviews feel more useful or merely less predictable?
- Can readers distinguish the targeted-gap result from the central-claim result?
- Does the two-question review still feel lightweight?
- Do readers trust the scheduling explanation?
- After repeated difficulty, does source-supported scaffolding feel helpful rather than punitive?
