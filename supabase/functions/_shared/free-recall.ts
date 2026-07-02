import { z } from "npm:zod@3.24.2";

export const PIPELINE_VERSION = "free-recall-v1.1";

export const IdeaStatusSchema = z.enum([
  "correct",
  "partially_correct",
  "missing",
  "distorted",
  "unsupported",
]);

export const RecallAnchorTypeSchema = z.enum([
  "claim",
  "entity",
  "temporal",
  "evidence",
  "relationship",
  "qualification",
]);

export const RecallPatternSchema = z.enum([
  "claim_loss",
  "entity_loss",
  "temporal_loss",
  "evidence_loss",
  "relationship_loss",
  "qualification_loss",
  "distortion_or_unsupported_addition",
]);

export const AnswerKeySchema = z.object({
  central_claim: z.string().min(1),
  supporting_ideas: z.array(z.object({
    id: z.string().min(1),
    idea: z.string().min(1),
  })).min(3).max(6),
  common_misreadings: z.array(z.string().min(1)).max(6),
  recall_anchors: z.array(z.object({
    id: z.string().min(1),
    type: RecallAnchorTypeSchema,
    text: z.string().min(1),
    why_it_matters: z.string().min(1),
  }).strict()).min(1).max(12),
}).strict();

export const GradingResultSchema = z.object({
  central_claim_score: z.number().int().min(0).max(4),
  supporting_ideas_score: z.number().int().min(0).max(4),
  accuracy_score: z.number().int().min(0).max(2),
  overall_score: z.number().int().min(0).max(100),
  central_claim_status: IdeaStatusSchema,
  idea_results: z.array(z.object({
    idea_id: z.string().min(1),
    status: IdeaStatusSchema,
    explanation: z.string().min(1),
    response_evidence: z.string().nullable(),
  }).strict()).min(3).max(6),
  unsupported_claims: z.array(z.string()),
  feedback: z.object({
    what_you_remembered: z.array(z.string()),
    what_you_missed: z.array(z.string()),
    what_may_be_distorted: z.array(z.string()),
    what_to_review_next: z.array(z.string()).min(1).max(3),
  }).strict(),
  recall_pattern_diagnosis: z.array(z.object({
    pattern: RecallPatternSchema,
    severity: z.number().min(0).max(1),
    evidence: z.array(z.string().min(1)).min(1).max(4),
    coaching: z.string().min(1),
    recommended_practice_type: z.string().min(1),
  }).strict()).max(3),
}).strict();

export type AnswerKey = z.infer<typeof AnswerKeySchema>;
export type GradingResult = z.infer<typeof GradingResultSchema>;

export const answerKeyJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["central_claim", "supporting_ideas", "common_misreadings", "recall_anchors"],
  properties: {
    central_claim: { type: "string" },
    supporting_ideas: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "idea"],
        properties: {
          id: { type: "string" },
          idea: { type: "string" },
        },
      },
    },
    common_misreadings: {
      type: "array",
      maxItems: 6,
      items: { type: "string" },
    },
    recall_anchors: {
      type: "array",
      minItems: 1,
      maxItems: 12,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "type", "text", "why_it_matters"],
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["claim", "entity", "temporal", "evidence", "relationship", "qualification"] },
          text: { type: "string" },
          why_it_matters: { type: "string" },
        },
      },
    },
  },
} as const;

const statusEnum = ["correct", "partially_correct", "missing", "distorted", "unsupported"];

export const gradingJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "central_claim_score",
    "supporting_ideas_score",
    "accuracy_score",
    "overall_score",
    "central_claim_status",
    "idea_results",
    "unsupported_claims",
    "feedback",
    "recall_pattern_diagnosis",
  ],
  properties: {
    central_claim_score: { type: "integer", minimum: 0, maximum: 4 },
    supporting_ideas_score: { type: "integer", minimum: 0, maximum: 4 },
    accuracy_score: { type: "integer", minimum: 0, maximum: 2 },
    overall_score: { type: "integer", minimum: 0, maximum: 100 },
    central_claim_status: { type: "string", enum: statusEnum },
    idea_results: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["idea_id", "status", "explanation", "response_evidence"],
        properties: {
          idea_id: { type: "string" },
          status: { type: "string", enum: statusEnum },
          explanation: { type: "string" },
          response_evidence: { type: ["string", "null"] },
        },
      },
    },
    unsupported_claims: { type: "array", items: { type: "string" } },
    feedback: {
      type: "object",
      additionalProperties: false,
      required: [
        "what_you_remembered",
        "what_you_missed",
        "what_may_be_distorted",
        "what_to_review_next",
      ],
      properties: {
        what_you_remembered: { type: "array", items: { type: "string" } },
        what_you_missed: { type: "array", items: { type: "string" } },
        what_may_be_distorted: { type: "array", items: { type: "string" } },
        what_to_review_next: {
          type: "array",
          minItems: 1,
          maxItems: 3,
          items: { type: "string" },
        },
      },
    },
    recall_pattern_diagnosis: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["pattern", "severity", "evidence", "coaching", "recommended_practice_type"],
        properties: {
          pattern: {
            type: "string",
            enum: [
              "claim_loss",
              "entity_loss",
              "temporal_loss",
              "evidence_loss",
              "relationship_loss",
              "qualification_loss",
              "distortion_or_unsupported_addition",
            ],
          },
          severity: { type: "number", minimum: 0, maximum: 1 },
          evidence: {
            type: "array",
            minItems: 1,
            maxItems: 4,
            items: { type: "string" },
          },
          coaching: { type: "string" },
          recommended_practice_type: { type: "string" },
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

export async function generateAnswerKey(
  passage: string,
  callModel: StructuredModelCall,
): Promise<AnswerKey> {
  const raw = await callModel({
    name: "free_recall_answer_key",
    schema: answerKeyJsonSchema as unknown as Record<string, unknown>,
    system: [
      "Create an answer key for meaning-based free recall.",
      "Identify one central claim, 3–6 indispensable supporting ideas, and plausible common misreadings.",
      "A supporting idea must help explain, justify, qualify, or apply the central claim.",
      "Also extract recall anchors: specific content a reader may need to remember to explain the passage well.",
      "Use anchor type claim for the main point, entity for names or named groups, temporal for dates or periods, evidence for concrete examples, relationship for cause, contrast, dependency, or tension, and qualification for limits, exceptions, boundaries, or contrast words.",
      "Use only the passage. Do not introduce outside knowledge.",
      "Return JSON matching the supplied schema and nothing else.",
    ].join(" "),
    input: `PASSAGE:\n${passage}`,
  });
  return AnswerKeySchema.parse(raw);
}

export async function gradeFreeRecall(
  passage: string,
  answerKey: AnswerKey,
  userResponse: string,
  callModel: StructuredModelCall,
): Promise<GradingResult> {
  const raw = await callModel({
    name: "free_recall_grade",
    schema: gradingJsonSchema as unknown as Record<string, unknown>,
    system: [
      "Grade meaning-based recall only.",
      "Do not grade prose style, grammar, spelling, organization, tone, vocabulary, or answer length.",
      "Award credit for accurate paraphrases and equivalent concepts.",
      "Mark a claim unsupported only when the response adds a substantive idea absent from or contradicted by the passage.",
      "central_claim_score is 0–4, supporting_ideas_score is 0–4, and accuracy_score is 0–2.",
      "Return one idea_result for every supporting idea in the answer key.",
      "Diagnose recall patterns by comparing the user response against answer_key.recall_anchors and the passage.",
      "Use recall_pattern_diagnosis to name the type of content the user lost, not only the exact fact. For example, if they omitted George Eliot and George Lewes, diagnose entity_loss. If they omitted decades or Victorian context, diagnose temporal_loss. If they omitted a because, contrast, boundary, or dependency, diagnose relationship_loss or qualification_loss.",
      "Only include recall_pattern_diagnosis items that are supported by missed, distorted, or unsupported content. For strong answers, include at most one low severity pattern to practice.",
      "Return concise, evidence-based feedback and JSON only.",
    ].join(" "),
    input: [
      `PASSAGE:\n${passage}`,
      `ANSWER KEY:\n${JSON.stringify(answerKey)}`,
      `USER RESPONSE:\n${userResponse}`,
    ].join("\n\n"),
  });
  const parsed = GradingResultSchema.parse(raw);
  return GradingResultSchema.parse({
    ...parsed,
    overall_score: (parsed.central_claim_score + parsed.supporting_ideas_score + parsed.accuracy_score) * 10,
  });
}
