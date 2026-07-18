import { createClient } from "npm:@supabase/supabase-js@2.49.1";

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
  throw new Error("The model returned no text.");
}

function compactString(value: unknown, maxLength = 1200): string {
  if (typeof value !== "string") return "";
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength)}...` : normalized;
}

function buildContextBlock(context: Record<string, unknown> = {}): string {
  const books = Array.isArray(context.books) ? context.books : [];
  const drafts = Array.isArray(context.drafts) ? context.drafts : [];
  const dueReviews = Array.isArray(context.due_reviews) ? context.due_reviews : [];
  const scheduledReviews = Array.isArray(context.scheduled_reviews) ? context.scheduled_reviews : [];
  const activeSkill = typeof context.active_skill === "string" ? context.active_skill : "";
  const recentChapters = Array.isArray(context.recent_chapters) ? context.recent_chapters : [];

  return JSON.stringify({
    active_skill: compactString(activeSkill, 180),
    books: books.slice(0, 8),
    drafts: drafts.slice(0, 4),
    due_reviews: dueReviews.slice(0, 6),
    scheduled_reviews: scheduledReviews.slice(0, 6),
    recent_chapters: recentChapters.slice(0, 6),
  }, null, 2);
}

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

    const body = await request.json().catch(() => ({}));
    const message = compactString(body?.message, 900);
    if (!message) throw new Error("message is required.");

    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");

    const system = [
      "You are Ember, a concise reading companion for a nonfiction comprehension app.",
      "Help the user decide what to read, review, practice, or revise next using the provided reading state.",
      "Be specific and grounded in the context. If the context is thin, say what Ember needs next.",
      "Do not pretend to have read books or chapters that are not represented in the context.",
      "Keep answers short: one direct answer plus at most two concrete next steps.",
    ].join(" ");

    const input = [
      `Reader state:\n${buildContextBlock(body?.context || {})}`,
      `User message:\n${message}`,
    ].join("\n\n");

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: Deno.env.get("OPENAI_CHAT_MODEL") || Deno.env.get("OPENAI_GRADING_MODEL") || "gpt-5.4-mini",
        store: false,
        max_output_tokens: 420,
        input: [
          { role: "system", content: [{ type: "input_text", text: system }] },
          { role: "user", content: [{ type: "input_text", text: input }] },
        ],
      }),
    });
    const responseBody = await response.json();
    if (!response.ok) throw new Error(responseBody?.error?.message || "OpenAI request failed.");

    return Response.json({
      answer: outputText(responseBody),
      model: responseBody?.model || null,
    }, { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to ask Ember." },
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
