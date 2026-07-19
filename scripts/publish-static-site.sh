#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

node scripts/stamp-assets.mjs
node --check app.js
git diff --check -- index.html app.js styles.css

git add index.html app.js styles.css
git commit -m "${1:-Publish static site update}"
git push origin main
