import { z } from "npm:zod@3.24.2";

export const STUDY_CHALLENGE_PIPELINE_VERSION = "study-challenge-v1";

export const ChallengeTypeSchema = z.enum([
  "central_claim",
  "supporting_idea",
  "relationship",
  "distortion",
  "unsupported_claim",
  "boundary_edge",
]);

export const ChallengeOutcomeSchema = z.enum([
  "resolved",
  "partially_resolved",
  "needs_another_pass",
]);

export const RubricStatusSchema = z.enum([
  "strong",
  "developing",
  "needs_work",
]);

export type ChallengeType = z.infer<typeof ChallengeTypeSchema>;

type RubricDimension = {
  id: string;
  label: string;
  principle: string;
  score_4: string;
  score_2: string;
  score_0: string;
};

export type StudyChallengeRubric = {
  type: ChallengeType;
  label: string;
  learning_basis: string;
  evaluates: string;
  dimensions: RubricDimension[];
};

export const STUDY_CHALLENGE_RUBRICS: Record<ChallengeType, StudyChallengeRubric> = {
  central_claim: {
    type: "central_claim",
    label: "Central claim challenge",
    learning_basis: "Retrieval practice plus gist extraction: the user must reconstruct the passage’s controlling claim from memory rather than recognize it.",
    evaluates: "Whether the response identifies what the author wants the reader to believe, not merely the topic.",
    dimensions: [
      {
        id: "claim_precision",
        label: "Claim precision",
        principle: "Gist retrieval",
        score_4: "States the author’s central claim as a clear, arguable proposition.",
        score_2: "Names the topic or a partial claim but loses the argument’s direction.",
        score_0: "Does not recover the central claim.",
      },
      {
        id: "scope_control",
        label: "Scope control",
        principle: "Source monitoring",
        score_4: "Keeps the claim at the right level of breadth for the passage.",
        score_2: "Overgeneralizes or narrows the claim in a way that changes emphasis.",
        score_0: "Makes a claim outside the passage’s scope.",
      },
      {
        id: "faithfulness",
        label: "Meaning fidelity",
        principle: "Semantic accuracy",
        score_4: "Accurately preserves the passage’s meaning in the user’s own words.",
        score_2: "Mostly faithful but misses an important qualification.",
        score_0: "Contradicts or materially distorts the passage.",
      },
    ],
  },
  supporting_idea: {
    type: "supporting_idea",
    label: "Supporting idea challenge",
    learning_basis: "Elaborative retrieval: the user strengthens memory by recovering reasons, evidence, mechanisms, or examples that support the claim.",
    evaluates: "Whether the response recovers support that actually matters to the central claim.",
    dimensions: [
      {
        id: "support_relevance",
        label: "Support relevance",
        principle: "Elaboration",
        score_4: "Names support that directly helps explain, justify, or qualify the central claim.",
        score_2: "Names a related detail but leaves its relevance underdeveloped.",
        score_0: "Does not identify meaningful support.",
      },
      {
        id: "support_completeness",
        label: "Support completeness",
        principle: "Retrieval depth",
        score_4: "Recovers enough of the idea for it to be useful later.",
        score_2: "Recovers a fragment but misses the reason, mechanism, or example.",
        score_0: "The supporting idea is absent.",
      },
      {
        id: "evidence_fidelity",
        label: "Evidence fidelity",
        principle: "Source-grounded recall",
        score_4: "Keeps the support consistent with the supplied passage.",
        score_2: "Mostly accurate but adds or drops an important qualification.",
        score_0: "Invents or contradicts evidence.",
      },
    ],
  },
  relationship: {
    type: "relationship",
    label: "Relationship challenge",
    learning_basis: "Self-explanation: explaining how ideas depend on each other improves transfer beyond rote recall.",
    evaluates: "Whether the user can explain how one idea supports, qualifies, causes, contrasts with, or depends on another.",
    dimensions: [
      {
        id: "relationship_type",
        label: "Relationship type",
        principle: "Self-explanation",
        score_4: "Correctly names the relationship between the ideas.",
        score_2: "Implies a relationship but does not specify how it works.",
        score_0: "Treats connected ideas as unrelated or connects the wrong ideas.",
      },
      {
        id: "causal_or_logical_link",
        label: "Logical link",
        principle: "Causal reasoning",
        score_4: "Explains the because/therefore/whereas logic linking the ideas.",
        score_2: "States both ideas but leaves the connective tissue thin.",
        score_0: "No meaningful logical link is provided.",
      },
      {
        id: "transferable_explanation",
        label: "Transferable explanation",
        principle: "Transfer",
        score_4: "Explains the relationship in a way that could be reused outside the passage.",
        score_2: "Gives a passage-bound explanation with limited transfer value.",
        score_0: "Does not produce an explanation that supports later use.",
      },
    ],
  },
  distortion: {
    type: "distortion",
    label: "Distortion challenge",
    learning_basis: "Error correction with feedback: the user repairs a materially misstated idea by comparing memory against the source.",
    evaluates: "Whether the response corrects the distorted idea without introducing a new distortion.",
    dimensions: [
      {
        id: "error_identification",
        label: "Error identification",
        principle: "Metacognitive monitoring",
        score_4: "Clearly identifies what was misstated or overclaimed.",
        score_2: "Notices something is off but does not isolate the error.",
        score_0: "Does not identify the distortion.",
      },
      {
        id: "corrected_meaning",
        label: "Corrected meaning",
        principle: "Corrective feedback",
        score_4: "Restates the idea faithfully and with the needed qualification.",
        score_2: "Partially corrects the idea but leaves a consequential ambiguity.",
        score_0: "Leaves the distortion intact or introduces a new one.",
      },
      {
        id: "source_alignment",
        label: "Source alignment",
        principle: "Source monitoring",
        score_4: "Grounds the correction in what the passage actually says.",
        score_2: "Is broadly plausible but weakly anchored to the passage.",
        score_0: "Relies on outside knowledge or unsupported inference.",
      },
    ],
  },
  unsupported_claim: {
    type: "unsupported_claim",
    label: "Unsupported claim challenge",
    learning_basis: "Source monitoring and discrimination: the user separates what the passage says from plausible but unsupported additions.",
    evaluates: "Whether the user can identify and remove claims not supported by the passage.",
    dimensions: [
      {
        id: "unsupported_detection",
        label: "Unsupported detection",
        principle: "Source monitoring",
        score_4: "Correctly identifies the substantive claim that went beyond the passage.",
        score_2: "Recognizes possible overreach but is vague about what is unsupported.",
        score_0: "Does not detect unsupported content.",
      },
      {
        id: "boundary_setting",
        label: "Boundary setting",
        principle: "Discrimination practice",
        score_4: "Draws a clear boundary between supported and unsupported claims.",
        score_2: "Draws a partial boundary but still blends source and inference.",
        score_0: "Continues to treat unsupported inference as source content.",
      },
      {
        id: "revision_quality",
        label: "Source-faithful revision",
        principle: "Corrective retrieval",
        score_4: "Rewrites the response so it stays faithful to the passage.",
        score_2: "Improves the response but leaves some unsupported language.",
        score_0: "Does not revise toward the source.",
      },
    ],
  },
  boundary_edge: {
    type: "boundary_edge",
    label: "Boundary / edge challenge",
    learning_basis: "Generative transfer: once recall is strong, the user tests assumptions, limits, and conditions for application.",
    evaluates: "Whether the user can pressure-test the argument without misrepresenting it.",
    dimensions: [
      {
        id: "assumption_identification",
        label: "Assumption or boundary",
        principle: "Critical evaluation",
        score_4: "Identifies a real assumption, boundary condition, or dependency in the argument.",
        score_2: "Names a possible limitation but keeps it generic.",
        score_0: "Does not identify a meaningful boundary.",
      },
      {
        id: "argument_impact",
        label: "Argument impact",
        principle: "Conditional reasoning",
        score_4: "Explains how the argument would weaken, narrow, or change if the boundary failed.",
        score_2: "Suggests impact but does not explain the mechanism.",
        score_0: "Does not connect the boundary to the argument.",
      },
      {
        id: "fairness_to_source",
        label: "Fairness to source",
        principle: "Epistemic calibration",
        score_4: "Challenges the argument while preserving what the author actually claimed.",
        score_2: "Mostly fair but slightly overstates or caricatures the argument.",
        score_0: "Attacks a claim the passage did not make.",
      },
    ],
  },
};

export const RubricScoreSchema = z.object({
  dimension_id: z.string().min(1),
  score: z.number().int().min(0).max(4),
  status: RubricStatusSchema,
  explanation: z.string().min(1),
  response_evidence: z.string().nullable(),
}).strict();

export const StudyChallengeEvaluationSchema = z.object({
  challenge_type: ChallengeTypeSchema,
  outcome: ChallengeOutcomeSchema,
  overall_score: z.number().int().min(0).max(100),
  rubric_scores: z.array(RubricScoreSchema).min(3).max(3),
  accuracy_score: z.number().int().min(0).max(2),
  feedback: z.object({
    what_worked: z.array(z.string()),
    what_to_strengthen: z.array(z.string()),
    what_to_try_next: z.array(z.string()).min(1).max(3),
  }).strict(),
}).strict();

export type StudyChallengeEvaluation = z.infer<typeof StudyChallengeEvaluationSchema>;

const challengeTypeEnum = ChallengeTypeSchema.options;
const outcomeEnum = ChallengeOutcomeSchema.options;
const rubricStatusEnum = RubricStatusSchema.options;

export const studyChallengeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["challenge_type", "outcome", "overall_score", "rubric_scores", "accuracy_score", "feedback"],
  properties: {
    challenge_type: { type: "string", enum: challengeTypeEnum },
    outcome: { type: "string", enum: outcomeEnum },
    overall_score: { type: "integer", minimum: 0, maximum: 100 },
    rubric_scores: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["dimension_id", "score", "status", "explanation", "response_evidence"],
        properties: {
          dimension_id: { type: "string" },
          score: { type: "integer", minimum: 0, maximum: 4 },
          status: { type: "string", enum: rubricStatusEnum },
          explanation: { type: "string" },
          response_evidence: { type: ["string", "null"] },
        },
      },
    },
    accuracy_score: { type: "integer", minimum: 0, maximum: 2 },
    feedback: {
      type: "object",
      additionalProperties: false,
      required: ["what_worked", "what_to_strengthen", "what_to_try_next"],
      properties: {
        what_worked: { type: "array", items: { type: "string" } },
        what_to_strengthen: { type: "array", items: { type: "string" } },
        what_to_try_next: {
          type: "array",
          minItems: 1,
          maxItems: 3,
          items: { type: "string" },
        },
      },
    },
  },
} as const;

export type StructuredModelCall = (args: {
  name: string;
  schema: Record<string, unknown>;
  system: string;
  input: string;
}) => Promise<unknown>;

function recomputeOverall(evaluation: StudyChallengeEvaluation): number {
  const rubricTotal = evaluation.rubric_scores.reduce((total, item) => total + item.score, 0);
  return Math.round(((rubricTotal + evaluation.accuracy_score) / 14) * 100);
}

function outcomeFor(score: number): z.infer<typeof ChallengeOutcomeSchema> {
  if (score >= 80) return "resolved";
  if (score >= 50) return "partially_resolved";
  return "needs_another_pass";
}

export async function gradeStudyChallenge(
  args: {
    challengeType: ChallengeType;
    passage: string;
    prompt: string;
    sourceEvidence: string;
    userResponse: string;
  },
  callModel: StructuredModelCall,
): Promise<StudyChallengeEvaluation> {
  const rubric = STUDY_CHALLENGE_RUBRICS[args.challengeType];
  const raw = await callModel({
    name: "study_challenge_evaluation",
    schema: studyChallengeJsonSchema as unknown as Record<string, unknown>,
    system: [
      "Evaluate a study challenge response using the supplied rubric only.",
      "Grade meaning, source fidelity, and the specific cognitive task. Do not grade writing polish, grammar, tone, vocabulary, or answer length.",
      "Award credit for accurate paraphrases.",
      "Use the passage and source evidence as the authority. Do not introduce outside knowledge.",
      "Return one rubric_scores item for every rubric dimension, using the exact dimension_id values.",
      "Return JSON matching the supplied schema and nothing else.",
    ].join(" "),
    input: [
      `CHALLENGE TYPE:\n${rubric.type}`,
      `RUBRIC:\n${JSON.stringify(rubric)}`,
      `PASSAGE:\n${args.passage}`,
      `SOURCE EVIDENCE:\n${args.sourceEvidence}`,
      `PROMPT:\n${args.prompt}`,
      `USER RESPONSE:\n${args.userResponse}`,
    ].join("\n\n"),
  });
  const parsed = StudyChallengeEvaluationSchema.parse(raw);
  const dimensionIds = new Set(rubric.dimensions.map((dimension) => dimension.id));
  const returnedIds = new Set(parsed.rubric_scores.map((score) => score.dimension_id));
  for (const id of dimensionIds) {
    if (!returnedIds.has(id)) throw new Error(`Missing rubric dimension: ${id}`);
  }
  const overall = recomputeOverall(parsed);
  return StudyChallengeEvaluationSchema.parse({
    ...parsed,
    challenge_type: args.challengeType,
    overall_score: overall,
    outcome: outcomeFor(overall),
  });
}
