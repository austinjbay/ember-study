import { assertEquals } from "jsr:@std/assert@1";
import {
  generateAnswerKey,
  gradeFreeRecall,
  type StructuredModelCall,
} from "../_shared/free-recall.ts";

const passage = "Focused work helps people learn difficult skills and produce valuable output. Shallow activity fragments attention and is easier to replicate. As focused work becomes rarer, its economic value increases.";

const answerKey = {
  central_claim: "Focused work is increasingly valuable because it enables difficult learning and high-value production.",
  supporting_ideas: [
    { id: "idea-1", idea: "Focused work enables difficult learning." },
    { id: "idea-2", idea: "Focused work supports valuable output." },
    { id: "idea-3", idea: "Shallow activity fragments attention and is easier to replicate." },
  ],
  common_misreadings: ["The chapter argues that all communication is useless."],
  recall_anchors: [
    { id: "anchor-claim", type: "claim", text: "Focused work is increasingly valuable.", why_it_matters: "It is the passage's central point." },
    { id: "anchor-evidence-1", type: "evidence", text: "Focused work helps people learn difficult skills.", why_it_matters: "It explains why focus matters." },
    { id: "anchor-relationship-1", type: "relationship", text: "Shallow activity fragments attention and is easier to replicate.", why_it_matters: "It contrasts focused work with shallow work." },
  ],
};

const cases = [
  {
    name: "strong",
    response: "Focused work is more valuable because concentration helps us learn hard things and create output that shallow, distracted work cannot easily match.",
    result: {
      central_claim_score: 4, supporting_ideas_score: 4, accuracy_score: 2, overall_score: 0,
      central_claim_status: "correct",
      idea_results: answerKey.supporting_ideas.map((idea) => ({ idea_id: idea.id, status: "correct", explanation: "Recovered accurately.", response_evidence: "focused work" })),
      unsupported_claims: [],
      feedback: { what_you_remembered: ["The main claim and support."], what_you_missed: [], what_may_be_distorted: [], what_to_review_next: ["Keep the relationship explicit."] },
      recall_pattern_diagnosis: [
        { pattern: "relationship_loss", severity: 0.2, evidence: ["The contrast with shallow work could be made sharper."], coaching: "When the main idea is present, look for the contrast that makes it matter.", recommended_practice_type: "relationship" },
      ],
    },
    expectedScore: 100,
  },
  {
    name: "vague",
    response: "The chapter was about focus being useful.",
    result: {
      central_claim_score: 2, supporting_ideas_score: 0, accuracy_score: 2, overall_score: 0,
      central_claim_status: "partially_correct",
      idea_results: answerKey.supporting_ideas.map((idea) => ({ idea_id: idea.id, status: "missing", explanation: "Not recovered.", response_evidence: null })),
      unsupported_claims: [],
      feedback: { what_you_remembered: ["Focus matters."], what_you_missed: ["Why it matters."], what_may_be_distorted: [], what_to_review_next: ["Recover the reasons."] },
      recall_pattern_diagnosis: [
        { pattern: "evidence_loss", severity: 0.85, evidence: ["The response misses difficult learning and valuable output."], coaching: "Keep one concrete reason attached to the main idea.", recommended_practice_type: "supporting_idea" },
      ],
    },
    expectedScore: 40,
  },
  {
    name: "hallucinated",
    response: "The author proves that remote employees work exactly twice as fast.",
    result: {
      central_claim_score: 0, supporting_ideas_score: 0, accuracy_score: 0, overall_score: 0,
      central_claim_status: "unsupported",
      idea_results: answerKey.supporting_ideas.map((idea) => ({ idea_id: idea.id, status: "missing", explanation: "Not recovered.", response_evidence: null })),
      unsupported_claims: ["Remote employees work exactly twice as fast."],
      feedback: { what_you_remembered: [], what_you_missed: ["The central claim."], what_may_be_distorted: ["The response adds an unsupported productivity statistic."], what_to_review_next: ["Reconstruct the central claim."] },
      recall_pattern_diagnosis: [
        { pattern: "distortion_or_unsupported_addition", severity: 1, evidence: ["Remote employees work exactly twice as fast."], coaching: "Separate what the text says from what feels plausible but unsupported.", recommended_practice_type: "unsupported_claim" },
      ],
    },
    expectedScore: 0,
  },
] as const;

Deno.test("answer-key output is validated", async () => {
  const call: StructuredModelCall = async () => answerKey;
  assertEquals(await generateAnswerKey(passage, call), answerKey);
});

for (const testCase of cases) {
  Deno.test(`grades a ${testCase.name} answer`, async () => {
    const call: StructuredModelCall = async () => testCase.result;
    const result = await gradeFreeRecall(passage, answerKey, testCase.response, call);
    assertEquals(result.overall_score, testCase.expectedScore);
  });
}
