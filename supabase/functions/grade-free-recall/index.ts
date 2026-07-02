import { createClient } from "npm:@supabase/supabase-js@2.49.1";
import {
  AnswerKeySchema,
  generateAnswerKey,
  gradeFreeRecall,
  PIPELINE_VERSION,
  type StructuredModelCall,
} from "../_shared/free-recall.ts";

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

    const { chapter_id, passage, user_response } = await request.json();
    if (typeof chapter_id !== "string" || !chapter_id) throw new Error("chapter_id is required.");
    if (typeof passage !== "string" || passage.trim().length < 80) throw new Error("A longer passage is required.");
    if (typeof user_response !== "string" || !user_response.trim()) throw new Error("user_response is required.");

    const passageHashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(passage));
    const passageHash = [...new Uint8Array(passageHashBuffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

    const { data: existingKey } = await supabase
      .from("free_recall_answer_keys")
      .select("id, answer_key")
      .eq("user_id", user.id)
      .eq("chapter_client_id", chapter_id)
      .eq("pipeline_version", PIPELINE_VERSION)
      .eq("passage_hash", passageHash)
      .maybeSingle();

    const answerKey = existingKey
      ? AnswerKeySchema.parse(existingKey.answer_key)
      : await generateAnswerKey(passage, callModel);
    const gradingResult = await gradeFreeRecall(passage, answerKey, user_response, callModel);

    const { data: keyRow, error: keyError } = existingKey
      ? { data: existingKey, error: null }
      : await supabase
      .from("free_recall_answer_keys")
      .upsert({
        user_id: user.id,
        chapter_client_id: chapter_id,
        pipeline_version: PIPELINE_VERSION,
        passage_hash: passageHash,
        answer_key: answerKey,
      }, { onConflict: "user_id,chapter_client_id,pipeline_version" })
      .select("id")
      .single();
    if (keyError) throw keyError;

    const { data: gradeRow, error: gradeError } = await supabase
      .from("free_recall_grades")
      .insert({
        user_id: user.id,
        chapter_client_id: chapter_id,
        answer_key_id: keyRow.id,
        pipeline_version: PIPELINE_VERSION,
        user_response,
        grading_result: gradingResult,
        overall_score: gradingResult.overall_score,
        central_claim_score: gradingResult.central_claim_score,
        supporting_ideas_score: gradingResult.supporting_ideas_score,
        accuracy_score: gradingResult.accuracy_score,
        overall_score_normalized: gradingResult.overall_score / 100,
        central_claim_score_normalized: gradingResult.central_claim_score / 4,
        supporting_ideas_score_normalized: gradingResult.supporting_ideas_score / 4,
        accuracy_score_normalized: gradingResult.accuracy_score / 2,
        recall_pattern_diagnosis: gradingResult.recall_pattern_diagnosis,
        primary_recall_pattern: gradingResult.recall_pattern_diagnosis[0]?.pattern || null,
        primary_recall_pattern_severity: gradingResult.recall_pattern_diagnosis[0]?.severity ?? null,
      })
      .select("id, created_at")
      .single();
    if (gradeError) throw gradeError;

    return Response.json({
      answer_key: answerKey,
      grading_result: gradingResult,
      grade_id: gradeRow.id,
      created_at: gradeRow.created_at,
    }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to grade recall." },
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
