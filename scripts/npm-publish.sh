#!/usr/bin/env bash
# Usage:
#   NPM_TOKEN=npm_xxx ./scripts/npm-publish.sh
# or:
#   ./scripts/npm-publish.sh --otp=123456
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
REG="${NPM_REGISTRY:-https://registry.npmjs.org/}"

if [[ -n "${NPM_TOKEN:-}" ]]; then
  export npm_config_registry="$REG"
  # Scoped auth for this publish only (does not rewrite your global ~/.npmrc)
  npm config set "//registry.npmjs.org/:_authToken" "$NPM_TOKEN" --location=project
  trap 'rm -f "$ROOT/.npmrc"' EXIT
fi

ARGS=(publish --access public --registry "$REG")
for a in "$@"; do
  ARGS+=("$a")
done

npm run build
npm test
npm "${ARGS[@]}"
echo "Published. Install: dsh plugin --profile web add dsh-shop-assistant"
