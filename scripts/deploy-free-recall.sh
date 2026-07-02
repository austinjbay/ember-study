#!/usr/bin/env bash
set -euo pipefail

PROJECT_REF="jwjcjpjbdhchmcocmkby"
MODEL="${OPENAI_GRADING_MODEL:-gpt-5.4-mini}"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required to run the Supabase CLI via npx." >&2
  exit 1
fi

if [[ -z "${SUPABASE_ACCESS_TOKEN:-}" ]]; then
  cat >&2 <<'EOF'
Missing SUPABASE_ACCESS_TOKEN.

Create one in Supabase:
  Account menu → Access Tokens → Generate token

Then run:
  export SUPABASE_ACCESS_TOKEN="your-token"
  ./scripts/deploy-free-recall.sh
EOF
  exit 1
fi

if [[ -z "${OPENAI_API_KEY:-}" ]]; then
  cat >&2 <<'EOF'
Missing OPENAI_API_KEY.

Set a server-side OpenAI API key in your local shell before deploying:
  export OPENAI_API_KEY="sk-..."
  ./scripts/deploy-free-recall.sh

Do not put this key in client-side JavaScript.
EOF
  exit 1
fi

echo "Linking Supabase project ${PROJECT_REF}..."
npx --yes supabase@latest link --project-ref "${PROJECT_REF}"

echo "Pushing database migrations..."
npx --yes supabase@latest db push

echo "Setting edge function secrets..."
npx --yes supabase@latest secrets set \
  OPENAI_API_KEY="${OPENAI_API_KEY}" \
  OPENAI_GRADING_MODEL="${MODEL}"

echo "Deploying grade-free-recall edge function..."
npx --yes supabase@latest functions deploy grade-free-recall

echo "Deploying grade-study-challenge edge function..."
npx --yes supabase@latest functions deploy grade-study-challenge

echo "Done. Free-recall and study-challenge grading are deployed."
