# Product research: a comprehension coach for serious readers

## Executive summary

The current prototype has a promising wedge: **after a person finishes a chapter, help them prove to themselves that they understood it and can use it**.

This is meaningfully different from:

- read-it-later products, which optimize capture and consumption;
- highlight systems, which optimize storage and resurfacing;
- summary products, which compress the source for the reader;
- school assessment products, which test answers selected by a teacher.

The product should initially serve **self-directed adult readers of nonfiction**: people reading to improve their work, judgment, or life who already suspect that highlighting and finishing books do not guarantee learning.

The recommended core loop is:

1. Finish a meaningful section.
2. Recall it without looking.
3. Compare the response with the source.
4. Repair one or two important gaps.
5. Revisit the ideas after a delay.
6. Apply one idea in a real situation.

The prototype already covers recall, key ideas, inference, and application. Its biggest missing pieces are a delayed review loop, source-grounded feedback, and a lower-friction way to add source material.

## Product thesis

**For curious professionals who read nonfiction to learn, this product turns each chapter into a short, source-grounded comprehension workout so they can see what stuck, repair what did not, and carry useful ideas into their lives.**

The product should not promise perfect comprehension or an authoritative intelligence score. It should promise a repeatable practice that makes understanding more visible.

## Why this problem is real

Reading comprehension is an active construction process, not a passive consequence of moving through text. Research summarized by the National Reading Panel supports explicit use of strategies such as summarizing, asking and answering questions, comprehension monitoring, and combining multiple strategies. The panel also found that active interaction with a text and connection to prior knowledge matter for comprehension.

Retrieval is especially important. In a controlled study of educational texts, retrieval practice outperformed repeated study and concept mapping on a test one week later; the advantage extended to questions requiring inference. An Institute of Education Sciences practice guide recommends active retrieval, delayed review, deep explanatory questions, and using quizzes to expose what still needs to be learned.

This supports the product's underlying behavior: ask a reader to reconstruct meaning before showing them an answer or summary.

It also suggests two cautions:

- A one-time response immediately after reading is not evidence of durable learning.
- Writing more is not automatically better. Prompts and feedback must focus attention on important ideas, relationships, evidence, and misconceptions.

## Initial target segment

### Primary user

**Self-directed nonfiction learner**

- Reads roughly one or more serious books per month.
- Reads for professional growth, decision-making, or personal development.
- Highlights, takes notes, or uses a knowledge-management tool.
- Often finishes a chapter with a feeling of familiarity but cannot later explain or apply it.
- Is willing to spend 5–10 minutes after a useful chapter, but not to build an elaborate study system.

Likely early-adopter clusters:

- founders, product people, designers, and knowledge workers;
- graduate students and adult learners;
- book-club members who want better discussion;
- users of Readwise, Kindle highlights, Obsidian, or Notion.

### Not the first segment

- Early readers who need decoding, fluency, or vocabulary intervention.
- K–12 classroom assessment, which adds teacher workflows, standards, accommodations, child safety, and procurement.
- Fiction readers, whose desired outcomes and assessment criteria differ substantially.
- High-stakes academic testing, where rubric validity and reliability requirements are much higher.

## Jobs to be done

### Functional jobs

- “After I read a chapter, help me discover whether I actually understood it.”
- “Show me the most important thing I missed without making me reread everything.”
- “Help me turn an interesting idea into something I can remember and use.”
- “Give me a lightweight record of what I learned from each book.”
- “Bring the right ideas back before they disappear.”

### Emotional jobs

- Replace vague familiarity with earned confidence.
- Reduce guilt about forgetting most of what was read.
- Make serious reading feel cumulative rather than disposable.
- Preserve the pleasure and autonomy of reading; do not turn every book into homework.

### Social jobs

- Arrive at a book-club or work discussion able to explain and defend an interpretation.
- Share a useful takeaway or application rather than a pile of quotations.

## Competitive landscape

| Product category | Representative product | What it does well | Gap this product can own |
|---|---|---|---|
| Read-it-later and annotation | Readwise Reader | Collects many formats; highlighting, annotation, summaries, text-to-speech, and syncing | Optimizes the reading and capture system more than an original, source-grounded comprehension performance |
| Highlight review | Readwise | Resurfaces highlights and supports repeated review | Reviewing selected passages can reinforce recognition; the reader is not consistently asked to reconstruct the chapter's argument |
| Book summaries | Shortform | Expert guides, analysis, audio, exercises, and broad catalog | Supplies an interpretation; it does not primarily evaluate the reader's own understanding of the original chapter |
| Reading tracking | Basmo and similar trackers | Goals, streaks, sessions, journal, and library | Measures reading behavior more than comprehension |
| Generic AI chat | ChatGPT and document-chat tools | Flexible questions, explanations, and summaries | Requires prompt skill and has no opinionated learning loop, progress model, or durable review schedule |
| Flashcards | Anki and similar tools | Excellent for atomic facts and spaced retrieval | High setup cost; weak fit for arguments, nuance, synthesis, and transfer unless cards are carefully authored |

The defensible position is not “AI for books.” It is **a structured evidence loop for understanding**:

> Reader's own answer → source evidence → diagnosis of gaps → targeted retry → delayed proof

## Assessment model

The current four dimensions are directionally strong, but they should be made more observable.

| Dimension | What to ask | What good performance looks like |
|---|---|---|
| Recall | “Explain the chapter's central claim and supporting points from memory.” | Covers the central claim and essential evidence without major fabrication |
| Understanding | “How do the three most important ideas relate?” | Selects important ideas, explains relationships, and uses accurate language |
| Inference | “What follows from the argument that the author does not state directly?” | Draws a defensible conclusion and anchors it in two or more parts of the source |
| Evaluation | “What is the weakest assumption, evidence, or boundary of the argument?” | Distinguishes source claims from the reader's judgment and cites relevant evidence |
| Transfer | “Where would this idea change a real decision or behavior?” | Names a concrete context, action, and expected consequence |

Add **evaluation** as a fifth dimension. Modern reading literacy includes judging quality, credibility, perspective, and evidence—not only remembering and applying content.

Scores should be presented as diagnostic bands rather than pseudo-precise percentages:

- Strong
- Developing
- Needs repair
- Not enough evidence

Each judgment should include:

- one source-grounded strength;
- one important omission or misconception;
- the exact passage or note supporting the feedback;
- one retry prompt.

The model should be allowed to say “not enough source text” or “multiple interpretations are defensible.”

## Recommended experience

### Session 1: immediate comprehension check

Keep it under eight minutes by default.

1. **Book and chapter** — import metadata where possible.
2. **Source** — accept EPUB/PDF selection, Kindle/Readwise highlights, photo/OCR, pasted notes, or pasted text.
3. **Closed-source recall** — hide the source while the reader answers.
4. **Adaptive follow-up** — ask one question based on the answer, rather than always requiring four long forms.
5. **Evidence reveal** — show where the answer aligns, misses, or overreaches.
6. **Repair** — ask the reader to revise only the weakest part.
7. **Application commitment** — optional for chapters where transfer is useful.

### Session 2: delayed proof

Return after approximately 2–7 days:

- one free-recall prompt;
- one inference or discrimination question;
- the prior application, with “Did you use this?”;
- a confidence rating before feedback.

The delayed result is a much better signal of durable learning than the immediate score.

### Progress

Track capabilities and behaviors, not only a single chapter percentage:

- chapters completed;
- delayed reviews completed;
- recurring gap type: missed claim, missed evidence, weak relationship, unsupported inference, vague application;
- calibration: confidence compared with demonstrated performance;
- ideas applied.

Avoid rewarding book count or answer length. Those metrics invite shallow optimization.

## MVP recommendation

### Build now

1. Source-grounded evaluation with citations to the supplied text.
2. Diagnostic feedback bands and a targeted retry.
3. A delayed review queue.
4. Flexible source ingestion, starting with pasted text/notes and file upload.
5. A chapter history that shows the original answer, repair, and delayed result.
6. Explicit “I disagree” and “feedback is unsupported” controls.

### Build next

- Readwise/Kindle import.
- Adaptive prompt selection by text type and reader goal.
- Confidence calibration.
- Book-club discussion mode.
- Longitudinal skill patterns across chapters.
- User-defined reading purpose before beginning a chapter.

### Defer

- Social feed.
- Large content catalog.
- Generic AI chat as the primary interface.
- Fine-grained numerical scoring.
- Streak mechanics that punish breaks.
- K–12 teacher dashboards and standards alignment.

## What to change in the existing prototype

1. **Replace the 150-word requirement with a range or a goal-sensitive prompt.** A rigid length can reward padding and may not suit chapter complexity.
2. **Hide source text during the first response.** The core behavior should be retrieval, not paraphrasing while looking.
3. **Replace lexical overlap scoring.** Word overlap can reward copying, penalize synonyms, and cannot reliably judge inference or application.
4. **Make every diagnosis traceable to evidence.** Feedback should link to relevant source passages.
5. **Add a repair step before “Saved.”** Learning happens when the reader notices and corrects a gap.
6. **Add delayed review as a first-class state.** “Saved” is an archival outcome; “review due” is a learning outcome.
7. **Add critical evaluation.** The current flow implicitly treats the author as correct.
8. **Make application optional.** Not every chapter contains an idea that should become a behavior.
9. **Use progressive disclosure.** Start with one broad recall prompt, then choose the next prompt based on the response.
10. **Separate confidence from correctness.** Ask “How well do you think you understood this?” before evaluation to build metacognitive calibration.

## Key risks

### AI feedback appears authoritative but is wrong

Mitigation: require source citations, show uncertainty, support disagreement, and avoid a single opaque grade.

### Copyright and privacy

Users may upload copyrighted books or sensitive work documents. Minimize stored source text, explain retention clearly, support deletion/export, and obtain legal guidance before storing or sharing full texts.

### The workout feels like homework

Mitigation: default to one broad prompt plus one adaptive follow-up; make depth selectable; celebrate repaired gaps rather than flawless performance.

### The product measures writing ability instead of comprehension

Mitigation: allow voice answers, short bullets, diagrams, and follow-up clarification. Evaluate ideas separately from prose polish.

### One rubric is applied to every text

Mitigation: distinguish argument, explanation, procedure, narrative, and reference text. Prompt and rubric should adapt to text structure and reading purpose.

## Research questions and validation plan

### Highest-risk assumptions

1. Readers feel the “I read it, but it did not stick” problem frequently enough to build a habit around it.
2. They will spend at least five minutes after a chapter.
3. Source-grounded corrective feedback feels useful rather than judgmental.
4. A delayed review creates perceived value rather than notification fatigue.
5. Users can supply enough source material without unacceptable friction.

### Discovery interviews

Recruit 12–15 self-directed nonfiction readers across heavy note-takers, casual highlighters, and book-club readers.

Ask about the last actual book, not general preferences:

- “What was the last chapter you read? Explain what you remember.”
- “What did you do after finishing it?”
- “When did you last need an idea from a book and fail to retrieve it?”
- “Show me your highlights or notes from that book.”
- “Which part of your current process feels like work?”
- “Have you paid for a reading, note-taking, summary, or learning product? Why?”
- “What kind of feedback would make you trust or reject an evaluator?”

Do not pitch the product until after the behavioral questions.

### Concierge test

Run a two-week test with 8–10 readers:

1. User sends one chapter excerpt or detailed notes.
2. Product gives a closed-source recall prompt.
3. A human-assisted evaluator returns cited feedback and one retry.
4. Product sends a delayed review three days later.
5. Interview the user immediately after the second review.

Success signals:

- at least 60% complete three chapter checks;
- at least 50% complete a delayed review without manual chasing;
- at least 70% of completed sessions contain a meaningful answer revision;
- users can name a specific gap the product helped them find;
- at least 3 of 10 ask to continue or indicate willingness to pay.

### Prototype experiments

| Experiment | Compare | Primary measure |
|---|---|---|
| Prompt burden | Four fixed prompts vs. one broad + one adaptive | Completion and perceived effort |
| Feedback style | Numeric score vs. diagnostic band + evidence | Trust and revision quality |
| Source entry | Paste full text vs. paste notes/highlights vs. file import | Time to first completed check |
| Review timing | 2 days vs. 7 days | Completion and delayed recall |
| Output mode | Typing vs. voice | Completion, answer quality, and preference |

## Metrics

### North-star candidate

**Meaningful comprehension loops completed per active reader per month**, where a loop includes:

- an original retrieval attempt;
- source-grounded feedback;
- a repair or confirmed strong answer;
- a delayed review.

### Supporting metrics

- time to first completed chapter check;
- immediate-to-delayed retention;
- percentage of feedback that produces a revision;
- delayed-review completion;
- source-ingestion abandonment;
- user-reported trust in feedback;
- unsupported-feedback reports;
- four-week retained readers;
- number of concrete applications revisited.

## Positioning concepts to test

1. **“Find out what actually stuck.”** Direct and closest to the current prototype.
2. **“A workout for what you read.”** Communicates active effort and repetition.
3. **“Turn chapters into usable knowledge.”** Stronger outcome orientation.

Avoid “AI tutor” as the lead. It is generic and emphasizes the mechanism rather than the reader's outcome.

## Sources

- [National Reading Panel summary: What Works in Comprehension Instruction](https://www.readingrockets.org/topics/curriculum-and-instruction/articles/what-works-comprehension-instruction)
- [National Reading Panel practical guide](https://www.readingrockets.org/sites/default/files/guide/nrp-report-practical-advice-for-teachers.pdf)
- [Duke, Ward, and Pearson: The Science of Reading Comprehension Instruction](https://www.readingrockets.org/resources/resource-library/science-reading-comprehension-instruction)
- [Karpicke and Blunt: Retrieval Practice Produces More Learning Than Elaborative Studying With Concept Mapping](https://pubmed.ncbi.nlm.nih.gov/21252317/)
- [Institute of Education Sciences: Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1)
- [OECD PISA 2018 Reading Framework](https://www.oecd.org/en/publications/pisa-2018-assessment-and-analytical-framework_b25efab8-en/full-report/component-3.html)
- [Readwise Reader documentation](https://docs.readwise.io/reader/docs)
- [Shortform product overview](https://www.shortform.com/)

