import { assertEquals } from "jsr:@std/assert@1";
import {
  gradeStudyChallenge,
  STUDY_CHALLENGE_RUBRICS,
  type ChallengeType,
  type StructuredModelCall,
} from "../_shared/study-challenge.ts";

const passage = "Focused work helps people learn difficult skills and produce valuable output. Shallow activity fragments attention and is easier to replicate. As focused work becomes rarer, its economic value increases.";

const baseResponses: Record<ChallengeType, string> = {
  central_claim: "The author argues focused work is becoming more valuable because it helps people learn hard skills and produce valuable output.",
  supporting_idea: "One key support is that shallow work fragments attention and is easier to copy, so it does not create the same value.",
  relationship: "Focused work enables difficult learning, and that learning makes valuable output possible; shallow work breaks that chain.",
  distortion: "The passage does not say all communication is useless. It says shallow activity fragments attention and is easier to replicate.",
  unsupported_claim: "The passage does not support the idea that remote employees work faster. It only claims focused work helps with learning and valuable output.",
  boundary_edge: "The argument would be less convincing in work where valuable output does not depend on difficult learning or sustained concentration.",
};

function modelResult(type: ChallengeType, scores: [number, number, number], accuracy = 2) {
  const rubric = STUDY_CHALLENGE_RUBRICS[type];
  return {
    challenge_type: type,
    outcome: "needs_another_pass",
    overall_score: 0,
    rubric_scores: rubric.dimensions.map((dimension, index) => ({
      dimension_id: dimension.id,
      score: scores[index],
      status: scores[index] >= 3 ? "strong" : scores[index] >= 2 ? "developing" : "needs_work",
      explanation: `Evaluated ${dimension.label}.`,
      response_evidence: scores[index] ? baseResponses[type] : null,
    })),
    accuracy_score: accuracy,
    feedback: {
      what_worked: scores.some((score) => score >= 3) ? ["Recovered the target meaning."] : [],
      what_to_strengthen: scores.some((score) => score < 3) ? ["Make the source relationship more explicit."] : [],
      what_to_try_next: ["Restate the answer against the source evidence."],
    },
  };
}

for (const type of Object.keys(STUDY_CHALLENGE_RUBRICS) as ChallengeType[]) {
  Deno.test(`grades ${type} with its distinct rubric`, async () => {
    const call: StructuredModelCall = async () => modelResult(type, [4, 4, 4], 2);
    const result = await gradeStudyChallenge({
      challengeType: type,
      passage,
      prompt: STUDY_CHALLENGE_RUBRICS[type].evaluates,
      sourceEvidence: passage,
      userResponse: baseResponses[type],
    }, call);
    assertEquals(result.challenge_type, type);
    assertEquals(result.overall_score, 100);
    assertEquals(result.outcome, "resolved");
    assertEquals(result.rubric_scores.map((score) => score.dimension_id), STUDY_CHALLENGE_RUBRICS[type].dimensions.map((dimension) => dimension.id));
  });
}

Deno.test("recomputes weak study challenge scores server-side", async () => {
  const call: StructuredModelCall = async () => modelResult("relationship", [1, 1, 0], 1);
  const result = await gradeStudyChallenge({
    challengeType: "relationship",
    passage,
    prompt: "How do the ideas depend on one another?",
    sourceEvidence: passage,
    userResponse: "They are connected somehow.",
  }, call);
  assertEquals(result.overall_score, 21);
  assertEquals(result.outcome, "needs_another_pass");
});
