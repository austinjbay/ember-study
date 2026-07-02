#!/usr/bin/env bash
set -euo pipefail

PROJECT_REF="jwjcjpjbdhchmcocmkby"

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
  ./scripts/deploy-normalized-scores.sh
EOF
  exit 1
fi

echo "Linking Supabase project ${PROJECT_REF}..."
npx --yes supabase@latest link --project-ref "${PROJECT_REF}"

echo "Pushing normalized score migration..."
npx --yes supabase@latest db push

echo "Deploying grade-free-recall edge function..."
npx --yes supabase@latest functions deploy grade-free-recall

echo "Deploying grade-study-challenge edge function..."
npx --yes supabase@latest functions deploy grade-study-challenge

echo "Done. Normalized score columns are deployed and grading functions are updated."
