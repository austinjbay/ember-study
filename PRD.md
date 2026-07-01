# Product requirements document: Reading Comprehension

**Status:** Draft for MVP  
**Audience:** Product, design, engineering, data, and research  
**Last updated:** June 30, 2026

## 1. Product summary

Reading Comprehension is a post-chapter learning experience for adults who read nonfiction to improve their work, judgment, or life. It asks readers to reconstruct a chapter from memory, evaluates that response against the supplied source, helps repair the most important gap, and returns after a delay to test whether the learning lasted.

The experience is not a summary generator, reading tracker, or authoritative test. It is a short, repeatable workout that makes understanding visible.

### Product promise

**Find out what actually stuck—and repair what did not.**

### Core loop

> Read → Recall → Compare → Repair → Revisit → Apply

## 2. Problem

Readers often mistake familiarity for understanding. Highlighting, rereading, and finishing a chapter can feel productive without enabling the reader to later explain its argument, identify its evidence, draw a defensible inference, or use an idea.

Existing products optimize adjacent jobs:

- reading and content capture;
- highlight storage and resurfacing;
- prewritten summaries;
- reading goals and streaks;
- factual flashcards.

They do not consistently ask the reader to produce an original account, diagnose it against the source, correct a gap, and demonstrate retention later.

## 3. Target user

### Primary persona: the intentional nonfiction reader

- Reads at least one serious nonfiction book per month.
- Reads for professional growth, decision-making, or personal development.
- Sometimes highlights or takes notes.
- Wants ideas to remain available after the book is closed.
- Will spend 5–8 minutes after a useful chapter.
- Does not want to maintain an elaborate study system.

### Primary jobs

- Discover whether a chapter was genuinely understood.
- Find the most consequential omission or misconception.
- Strengthen memory without rereading the entire chapter.
- Turn useful ideas into concrete decisions or behavior.
- Build a durable record of learning across books.

### Out of scope for MVP

- Early literacy, decoding, and fluency instruction.
- K–12 classroom management or standards alignment.
- High-stakes assessment.
- Fiction-specific analysis.
- Collaborative classrooms and social feeds.

## 4. Goals and non-goals

### Product goals

1. Let a new user complete a useful comprehension check in under eight minutes, excluding source upload time.
2. Produce feedback that is traceable to the reader's source material.
3. Cause the reader to notice and repair at least one meaningful gap when one exists.
4. Create a lightweight delayed-review habit.
5. Preserve reading as an autonomous, enjoyable activity rather than making every chapter feel assigned.

### Business and learning goals

- Validate that readers return for multiple chapter checks.
- Validate willingness to supply sufficient source material.
- Demonstrate that delayed reviews reveal or reinforce learning beyond an immediate check.
- Establish trust in source-grounded AI feedback.

### Non-goals

- Proving a standardized improvement in general reading ability.
- Replacing the source with an AI summary.
- Assigning grades, rankings, or intelligence scores.
- Maximizing time in product.
- Rewarding answer length, book count, or daily streaks.

## 5. Success metrics

### North-star metric

**Meaningful comprehension loops completed per active reader per month.**

A loop is complete when it includes:

1. an original retrieval attempt;
2. source-grounded feedback;
3. a repair attempt or a confirmed strong response;
4. a delayed review.

### MVP funnel metrics

- Percentage of users who begin a check after adding a source.
- Percentage who submit the initial recall.
- Percentage who view feedback.
- Percentage with a gap who submit a repair.
- Percentage who schedule a delayed review.
- Percentage who complete the delayed review.
- Median time to first completed immediate session.
- Four-week return rate.

### Quality and trust metrics

- Percentage of feedback items with valid source evidence.
- “Feedback unsupported” reports per evaluation.
- Reader agreement with the identified primary gap.
- Percentage of repairs that resolve the identified gap.
- Confidence calibration: self-rating compared with diagnostic result.
- Delayed performance compared with immediate performance.

### Initial validation targets

- 60% of test users complete at least three immediate chapter checks in two weeks.
- 50% complete at least one delayed review without manual follow-up.
- 70% of sessions containing a meaningful gap result in a repair attempt.
- 70% of users can name a specific gap the product helped reveal.
- Fewer than 5% of feedback claims are reported as unsupported.

These are learning targets for a small beta, not long-term operating benchmarks.

## 6. Experience principles

1. **Retrieval before recognition.** Do not reveal the source or generated explanation before the reader's first attempt.
2. **Evidence over authority.** Every substantive diagnosis must point to the source.
3. **Repair over judgment.** The product's job is to improve understanding, not merely label it.
4. **Depth without ceremony.** Ask the smallest number of questions that can produce useful evidence.
5. **Uncertainty is legitimate.** The evaluator may say the source is insufficient or multiple interpretations are defensible.
6. **Ideas over prose polish.** Bullets, fragments, and voice responses are acceptable.
7. **Progress without punishment.** No loss-framed streaks or shame-based reminders.
8. **The author can be questioned.** Understanding an argument does not require agreeing with it.

## 7. Core user journey

### 7.1 Start or resume

The home experience contains:

- **Start a chapter check**
- **Reviews due**
- **Continue draft**, when applicable
- **Library**, organized by book and chapter

New users see a brief explanation:

> Add a chapter or detailed notes. You will explain it from memory, compare your answer with the source, and revisit it in a few days.

Account creation should not block the first immediate check. It may be requested when the user saves or schedules a review.

### 7.2 Add reading

Required:

- Book title
- Chapter or section title
- Source material

Optional:

- Author
- Reading purpose
- Application desired: yes, no, or decide later

MVP source methods:

- Paste chapter text or excerpt.
- Paste detailed notes or highlights.
- Upload a text-based PDF or EPUB.

The product must:

- identify the source type;
- confirm that enough content was extracted;
- allow the reader to inspect and correct extracted text;
- explain whether evaluation will be limited because only notes or highlights were supplied.

### 7.3 Prepare the check

Before recall, show:

- book and chapter;
- estimated session length;
- a reminder that the source will be hidden;
- a control to start when ready.

If the user supplied a long source, the system may analyze it before the check. Analysis must not expose a generated summary.

### 7.4 Initial recall

Default prompt:

> Without looking back, explain the chapter's central claim and the supporting ideas that matter most. Bullets are fine.

Requirements:

- Accept typed text.
- Autosave locally or to the account.
- Display an optional elapsed timer, not a countdown.
- Do not require a fixed word count.
- Allow “I don't remember” as a valid submission.
- Keep the source inaccessible from the answer surface except through an explicit “End recall and view source” action.

After answering, collect confidence:

> How well do you think you understood this chapter?

Use a four-point scale:

- Not yet
- Partly
- Mostly
- Very well

Confidence must be collected before feedback is shown.

### 7.5 Adaptive follow-up

The evaluator selects at most one follow-up for the default session.

Possible dimensions:

- understanding of relationships;
- inference;
- critical evaluation;
- transfer.

Selection rules:

- Ask about relationships if the recall lists ideas without connecting them.
- Ask an inference question if the chapter's argument supports a meaningful unstated conclusion.
- Ask an evaluation question when the text contains an argument, evidence, or consequential assumption.
- Ask about transfer only when the reader requested it or the chapter offers a plausible application.
- Skip the follow-up when the initial response already provides enough evidence or the reader selects “Quick check.”

The follow-up must be grounded in the source but must not reveal the answer.

### 7.6 Evaluation

Evaluate observable comprehension across only the dimensions for which the session provides evidence.

Diagnostic bands:

- **Strong:** Accurate and sufficiently complete for the prompt.
- **Developing:** Broadly accurate, with an important omission or unclear relationship.
- **Needs repair:** Contains a consequential misconception, unsupported conclusion, or misses the central claim.
- **Not enough evidence:** The response or source cannot support a responsible judgment.

Feedback structure:

1. **What you understood** — one specific strength.
2. **The most useful gap** — one high-impact omission, misconception, or weak relationship.
3. **Evidence from the chapter** — one or more expandable source excerpts.
4. **Try this now** — one focused repair prompt.

Additional requirements:

- Distinguish a reader's disagreement from a misunderstanding.
- Do not score grammar, style, or answer length.
- Do not claim that an interpretation is wrong when the source reasonably supports it.
- Do not fabricate page numbers or quotations.
- Excerpts must link to their location in the uploaded or pasted source.
- Display “AI-generated feedback; verify against the source.”
- Provide “I disagree” and “This evidence does not support the feedback.”

The default interface must not show a percentage or aggregate score.

### 7.7 Repair

When the diagnostic band is Developing or Needs repair:

- ask one focused retry question;
- keep the source evidence visible;
- accept a short response;
- compare the repair with the identified gap;
- state whether the repair resolved it, partially resolved it, or introduced a new conflict.

When the response is Strong:

- do not manufacture a weakness;
- offer a concise challenge question or allow the user to finish.

The chapter is marked **Immediate check complete** after repair or after a Strong result.

### 7.8 Application

Application is optional.

Prompt:

> Is there a real decision, behavior, or situation where this idea would matter?

If yes, collect:

- context;
- intended action;
- optional review date.

The evaluator checks specificity, not whether the action is morally or strategically correct. High-risk medical, legal, or financial applications must include an appropriate caution and must not be treated as professional advice.

### 7.9 Schedule delayed review

Default review timing: three days after the immediate check.

The reader can choose:

- Tomorrow
- In 3 days
- In 7 days
- Choose a date
- Do not remind me

MVP reminder channels:

- in-product review queue;
- email, with explicit opt-in.

Scheduling must not block saving the chapter.

### 7.10 Delayed review

The review begins without showing the prior answer or source.

Required sequence:

1. Free recall of the central claim and important support.
2. Confidence rating.
3. One short inference, distinction, or relationship question.
4. Source-grounded feedback.
5. Prior application check-in, if one exists.

The result should emphasize change:

- Retained
- Partly retained
- Needs another pass
- Not enough evidence

Show:

- ideas retained from the immediate session;
- ideas lost or distorted;
- confidence calibration;
- one recommended next action.

The user may schedule another review, but the MVP does not need a full spaced-repetition algorithm.

### 7.11 Library and chapter history

The library is organized:

> Book → Chapter → Attempts

Each chapter shows:

- status: Draft, Ready to recall, Feedback ready, Repair needed, Review scheduled, Review due, or Complete;
- source type;
- immediate-check date;
- diagnostic bands;
- repair outcome;
- next review date;
- application, when present.

The chapter detail preserves:

- original response;
- confidence rating;
- feedback and cited evidence;
- repair response;
- delayed response and result;
- user disputes.

Users can edit metadata, delete a chapter, delete its source while retaining their own responses, or export their responses and feedback.

## 8. Functional requirements

Priority uses:

- **P0:** required to test the core loop;
- **P1:** important for a credible private beta;
- **P2:** later enhancement.

### 8.1 Source ingestion

| ID | Requirement | Priority |
|---|---|---|
| SRC-01 | Accept pasted source text and pasted notes/highlights. | P0 |
| SRC-02 | Preserve paragraph boundaries and stable passage identifiers for citations. | P0 |
| SRC-03 | Reject empty or clearly insufficient sources with actionable guidance. | P0 |
| SRC-04 | Allow text-based PDF and EPUB upload. | P1 |
| SRC-05 | Show extraction status, errors, and editable extracted text. | P1 |
| SRC-06 | Distinguish full source from partial source or notes in evaluation. | P0 |
| SRC-07 | Import from Readwise or Kindle. | P2 |
| SRC-08 | Support image/OCR ingestion. | P2 |

### 8.2 Recall and responses

| ID | Requirement | Priority |
|---|---|---|
| RCL-01 | Hide the source during initial and delayed recall. | P0 |
| RCL-02 | Accept unformatted text and bullets. | P0 |
| RCL-03 | Autosave drafts and restore them after interruption. | P0 |
| RCL-04 | Collect confidence before revealing feedback. | P0 |
| RCL-05 | Support voice response and transcription. | P1 |
| RCL-06 | Allow the user to end recall and view the source with a clear warning. | P1 |

### 8.3 Evaluation and repair

| ID | Requirement | Priority |
|---|---|---|
| EVA-01 | Evaluate against the supplied source, not external knowledge. | P0 |
| EVA-02 | Return a band, strength, primary gap, evidence, and repair prompt in a structured format. | P0 |
| EVA-03 | Validate that cited excerpts exist in the source before displaying feedback. | P0 |
| EVA-04 | Support Not enough evidence and multiple defensible interpretations. | P0 |
| EVA-05 | Accept and evaluate a repair response. | P0 |
| EVA-06 | Provide dispute and unsupported-evidence controls. | P0 |
| EVA-07 | Never expose chain-of-thought; provide concise conclusions and evidence. | P0 |
| EVA-08 | Select one adaptive follow-up. | P1 |
| EVA-09 | Adapt prompts to argument, explanation, procedure, or reference text. | P2 |

### 8.4 Delayed review

| ID | Requirement | Priority |
|---|---|---|
| REV-01 | Schedule a review for a chosen date. | P0 |
| REV-02 | Surface due reviews on home. | P0 |
| REV-03 | Run delayed recall without revealing prior work. | P0 |
| REV-04 | Compare immediate and delayed attempts at the idea level. | P0 |
| REV-05 | Send opt-in email reminders. | P1 |
| REV-06 | Reschedule or dismiss a review without penalty. | P0 |
| REV-07 | Recommend subsequent review timing algorithmically. | P2 |

### 8.5 Library and account

| ID | Requirement | Priority |
|---|---|---|
| LIB-01 | Save books, chapters, responses, feedback, and review state. | P0 |
| LIB-02 | Organize chapters under books. | P0 |
| LIB-03 | Show the complete attempt history. | P0 |
| LIB-04 | Delete a chapter and all associated data. | P0 |
| LIB-05 | Delete source material while preserving user-authored responses. | P1 |
| LIB-06 | Export user-authored responses and feedback. | P1 |
| LIB-07 | Let a user complete the first check before requiring an account. | P1 |

## 9. Evaluation contract

The evaluation service must return structured data containing:

- evaluated dimensions;
- diagnostic band per dimension;
- concise rationale;
- strength;
- primary gap type;
- primary gap description;
- cited source passage identifiers and exact excerpts;
- repair prompt;
- confidence or uncertainty;
- whether multiple interpretations are defensible;
- whether source coverage is insufficient.

### Allowed gap types

- Missed central claim
- Missed supporting evidence
- Weak relationship between ideas
- Consequential misconception
- Unsupported inference
- Author claim confused with reader opinion
- Vague application
- Insufficient response
- Insufficient source

### Citation validation

Before feedback is shown:

1. Each quoted excerpt must exactly match normalized source text.
2. Each passage identifier must resolve to a visible location.
3. A missing or invalid citation causes the affected claim to be removed or regenerated.
4. The interface must never imply that supplied notes are the full chapter.

## 10. States and edge cases

The system must handle:

- Source too short to identify a central claim.
- Source composed only of disconnected highlights.
- PDF with no extractable text.
- Very long source still processing.
- Reader submits an empty or “I don't remember” response.
- Reader accurately disagrees with the author.
- Source contains multiple competing arguments.
- Evaluator finds no meaningful weakness.
- Feedback generation fails after the response is saved.
- Reader opens the source during recall.
- Reader misses a review date.
- Reader deletes source material before delayed review.
- Duplicate book or chapter titles.
- Offline interruption while drafting.

Failure states must preserve the user's response and offer a retry. A missed review becomes overdue; it does not break progress.

## 11. Content and interaction requirements

### Voice

- Direct, calm, and intellectually respectful.
- Specific without sounding clinical.
- Curious rather than congratulatory or punitive.
- Never imply that difficulty means low ability.

### Preferred language

- “What stuck?”
- “Here is the most useful gap.”
- “The chapter supports this with…”
- “Try that part once more.”
- “Your interpretation is defensible.”

### Avoid

- “You failed.”
- “Mastery score.”
- “Incorrect” without qualification and evidence.
- Inflated praise.
- School-like point totals.
- “Perfect comprehension.”

### Accessibility

- Meet WCAG 2.2 AA for the web experience.
- Full keyboard operation.
- Visible focus states.
- Screen-reader labels and live status messages.
- No meaning conveyed only by color.
- Adjustable text size without loss of functionality.
- Reduced-motion support.
- Voice input must always have an editable transcript.

## 12. Notifications

- Reviews are reminders, not obligations.
- Ask for email permission only after the user schedules a review.
- Include the book, chapter, estimated time, and a direct start action.
- Allow reschedule and unsubscribe from every reminder.
- Do not use guilt, urgency, or streak-loss language.
- Limit to one reminder per due review unless the user opts into a follow-up.

## 13. Privacy, copyright, and safety

### Privacy

- Clearly disclose what source material and responses are stored.
- Encrypt data in transit and at rest.
- Do not use private source material or responses for model training without explicit opt-in.
- Support deletion of source material and full account deletion.
- Define and expose retention behavior.
- Avoid logging raw chapter text in analytics or error telemetry.

### Copyright

- Treat uploads as private material supplied for personal analysis.
- Do not create a public source library from user uploads.
- Do not enable sharing of substantial source excerpts.
- Limit citations in feedback to the minimum passage needed.
- Obtain legal review before commercial launch.

### AI and safety

- Label AI-generated feedback.
- Ground evaluation in the supplied text.
- Allow user correction and dispute.
- Apply safety handling when the source or proposed application involves self-harm, medical, legal, financial, or other high-risk decisions.

## 14. Analytics

### Core events

- `chapter_started`
- `source_added`
- `source_processing_failed`
- `recall_started`
- `recall_submitted`
- `confidence_submitted`
- `followup_submitted`
- `feedback_generated`
- `feedback_generation_failed`
- `evidence_opened`
- `feedback_disputed`
- `evidence_reported_unsupported`
- `repair_submitted`
- `repair_resolved`
- `application_saved`
- `review_scheduled`
- `review_rescheduled`
- `review_started`
- `review_completed`
- `chapter_deleted`
- `source_deleted`

### Event properties

Use metadata such as:

- source type and approximate length band;
- full source versus notes;
- session mode;
- diagnostic band;
- gap type;
- response length band;
- time to complete;
- confidence level;
- reminder channel;
- days until review.

Do not send source text, response text, quotations, book title, or author name to general-purpose analytics.

## 15. Non-functional requirements

- User input must be saved before any evaluation request begins.
- Draft recovery must survive refresh and ordinary network failure.
- Standard evaluations should complete within 20 seconds at p95; show meaningful progress after two seconds.
- The service must be idempotent so retrying does not create duplicate attempts.
- Source and response access must be scoped to the authenticated user.
- Evaluation versions must be recorded for audit and quality analysis.
- Generated feedback and cited evidence must remain reproducible for a saved attempt.
- The responsive web experience must support current major desktop and mobile browsers.

## 16. MVP scope

### P0 private-beta release

- Pasted source or notes.
- Book and chapter metadata.
- Closed-source initial recall.
- Confidence rating.
- Source-grounded diagnostic feedback with citation validation.
- One targeted repair.
- Save to library.
- Schedule, surface, and complete a delayed review.
- Compare immediate and delayed understanding.
- Feedback dispute and unsupported-evidence reporting.
- Delete chapter and associated data.
- Essential analytics and evaluation audit data.

### P1 beta improvements

- Text-based PDF and EPUB upload.
- Voice responses.
- One adaptive follow-up.
- Email reminders.
- Source deletion independent of response history.
- Data export.
- Guest first session.

### Explicitly deferred

- Readwise and Kindle integrations.
- OCR.
- Full spaced-repetition scheduler.
- Book clubs and sharing.
- Social activity.
- Teacher dashboards.
- General-purpose document chat.
- Numerical scores.

## 17. Acceptance criteria for the core loop

A P0 build is ready for private beta when:

1. A user can paste a valid chapter source, add metadata, and begin recall.
2. The source is not visible during recall.
3. Refreshing the page does not lose a saved draft.
4. The user can submit bullets or prose without a word-count requirement.
5. Confidence is captured before feedback appears.
6. Feedback contains a strength, one primary gap, source evidence, and one repair prompt.
7. Every displayed quotation resolves to text in the supplied source.
8. The evaluator can return Not enough evidence.
9. A user can dispute feedback or report unsupported evidence.
10. A user with a gap can submit a repair and receive a repair outcome.
11. A completed session can be saved and scheduled for later review.
12. A due review appears on home and begins without showing the source or prior answer.
13. The delayed result compares retained and lost ideas without a percentage score.
14. The complete attempt history is available in the library.
15. The user can delete the chapter and its associated data.
16. Evaluation failure never discards a submitted response.
17. No raw source or response content is sent to general analytics.

## 18. Rollout and validation

### Phase 1: moderated prototype

- 8–10 target readers.
- Human-assisted evaluation where needed.
- Observe source entry, recall, feedback interpretation, and repair.
- Test fixed prompts against one broad prompt plus an adaptive follow-up.

### Phase 2: private beta

- 30–50 readers for four weeks.
- Instrument the complete immediate and delayed loop.
- Audit a sample of AI feedback for citation validity, accuracy, and tone.
- Interview users who complete, abandon, and dispute feedback.

### Phase 3: decision gate

Proceed to a broader beta only if:

- repeated chapter use is evident;
- delayed reviews are completed without high reminder pressure;
- unsupported feedback is acceptably rare;
- source ingestion is not the dominant abandonment point;
- users describe value in terms of understanding or retention, not novelty.

## 19. Open questions

1. Is a three-day default review better than allowing the reader to choose without a default?
2. How much source text is sufficient for useful evaluation?
3. Should partial notes produce feedback or only reader-authored reflection?
4. Does one adaptive follow-up improve diagnosis enough to justify added time?
5. Will users trust diagnostic bands without a numerical score?
6. When should application be suggested rather than omitted?
7. Is voice the preferred response mode on mobile?
8. What is the minimum viable account boundary for guest use and reminders?
9. Should users be able to edit source text after an evaluation, and how should that affect history?
10. What evidence-quality threshold should block an evaluation entirely?

## 20. Decisions captured

- Initial market: adult, self-directed nonfiction readers.
- Primary unit: a chapter or meaningful section.
- Default immediate session: one broad recall plus at most one follow-up.
- Assessment output: diagnostic bands, not percentages.
- Feedback: source-grounded and citation-validated.
- Repair: required when a meaningful gap is identified.
- Application: optional.
- Delayed review: first-class part of the product, not a later add-on.
- Progress: based on completed learning loops and recurring gap patterns, not streaks or book totals.

