#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
REPO="pengzhou267-ai/dsh-shop-assistant"
if command -v gh >/dev/null 2>&1; then
  gh repo create "$REPO" --public --source=. --remote=origin --push \
    --description "DSH ecommerce operator plugin: CSV tools, scoring, Chinese skills" || true
  gh repo edit "$REPO" --add-topic dsh-plugin --add-topic dsh --add-topic ecommerce || true
else
  echo "Create https://github.com/new (name: dsh-shop-assistant, public), then:"
  echo "  git push -u origin main"
fi
echo "npm: npm publish --access public --registry https://registry.npmjs.org/"
