import { createClient } from "npm:@supabase/supabase-js@2.49.1";
import {
  ChallengeTypeSchema,
  gradeStudyChallenge,
  STUDY_CHALLENGE_PIPELINE_VERSION,
  type StructuredModelCall,
} from "../_shared/study-challenge.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function outputText(response: Record<string, unknown>): string {
  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output as Array<Record<string, unknown>>) {
    const content = Array.isArray(item.content) ? item.content : [];
    for (const part of content as Array<Record<string, unknown>>) {
      if (part.type === "output_text" && typeof part.text === "string") return part.text;
    }
  }
  throw new Error("The model returned no structured output.");
}

const callModel: StructuredModelCall = async ({ name, schema, system, input }) => {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: Deno.env.get("OPENAI_GRADING_MODEL") || "gpt-5.4-mini",
      input: [
        { role: "system", content: [{ type: "input_text", text: system }] },
        { role: "user", content: [{ type: "input_text", text: input }] },
      ],
      text: {
        format: {
          type: "json_schema",
          name,
          strict: true,
          schema,
        },
      },
    }),
  });
  const body = await response.json();
  if (!response.ok) throw new Error(body?.error?.message || "OpenAI request failed.");
  return JSON.parse(outputText(body));
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authorization } } },
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });

    const {
      chapter_id,
      free_recall_grade_id,
      challenge_type,
      passage,
      prompt,
      source_evidence,
      user_response,
    } = await request.json();

    if (typeof chapter_id !== "string" || !chapter_id) throw new Error("chapter_id is required.");
    if (typeof passage !== "string" || passage.trim().length < 80) throw new Error("A longer passage is required.");
    if (typeof prompt !== "string" || !prompt.trim()) throw new Error("prompt is required.");
    if (typeof source_evidence !== "string" || !source_evidence.trim()) throw new Error("source_evidence is required.");
    if (typeof user_response !== "string" || !user_response.trim()) throw new Error("user_response is required.");

    const parsedType = ChallengeTypeSchema.parse(challenge_type);
    const evaluation = await gradeStudyChallenge({
      challengeType: parsedType,
      passage,
      prompt,
      sourceEvidence: source_evidence,
      userResponse: user_response,
    }, callModel);

    const { data: row, error: insertError } = await supabase
      .from("study_challenge_evaluations")
      .insert({
        user_id: user.id,
        chapter_client_id: chapter_id,
        free_recall_grade_id: typeof free_recall_grade_id === "string" && free_recall_grade_id ? free_recall_grade_id : null,
        pipeline_version: STUDY_CHALLENGE_PIPELINE_VERSION,
        challenge_type: parsedType,
        prompt,
        source_evidence,
        user_response,
        evaluation_result: evaluation,
        overall_score: evaluation.overall_score,
        outcome: evaluation.outcome,
        rubric_scores: evaluation.rubric_scores,
        accuracy_score: evaluation.accuracy_score,
        overall_score_normalized: evaluation.overall_score / 100,
        accuracy_score_normalized: evaluation.accuracy_score / 2,
        rubric_scores_normalized: evaluation.rubric_scores.map((score) => ({
          ...score,
          score_normalized: score.score / 4,
        })),
      })
      .select("id, created_at")
      .single();
    if (insertError) throw insertError;

    return Response.json({
      evaluation_result: evaluation,
      challenge_evaluation_id: row.id,
      created_at: row.created_at,
    }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to grade study challenge." },
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
