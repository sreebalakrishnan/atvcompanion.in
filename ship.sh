#!/usr/bin/env bash
# ship.sh — one-command release flow for the Astrology 101 Companion App.
#
# After Claude lands changes, run:
#   ./ship.sh
#
# It reads the current version from version.json, stages everything,
# commits with a version-tagged message, and pushes to origin/main.
#
# Optional: pass a short description as an argument:
#   ./ship.sh "Refresh Avatars quiz"
# That becomes part of the commit message.

set -euo pipefail

cd "$(dirname "$0")"

# Pull the version from version.json (no jq dependency — uses python).
VERSION=$(python3 -c "import json; print(json.load(open('version.json'))['version'])")

if [ -z "$VERSION" ]; then
  echo "Could not read version from version.json. Aborting."
  exit 1
fi

# Optional short description from $1; otherwise fall back to a generic line.
DESC="${1:-release}"

MSG="v${VERSION} — ${DESC}"

echo "→ Shipping v${VERSION}"
echo "  Commit message: ${MSG}"
echo ""

# Show what will be committed
echo "→ Staging all changes…"
git add -A

# Bail early if there's nothing to commit
if git diff --cached --quiet; then
  echo "  (no changes staged — nothing to ship)"
  exit 0
fi

# Show short status summary
echo ""
echo "→ Files in this commit:"
git diff --cached --stat | tail -20
echo ""

# Commit
git commit -m "${MSG}"

# Push
echo ""
echo "→ Pushing to origin/main…"
git push origin main

echo ""
echo "✦ Shipped v${VERSION} → github.com/sreebalakrishnan/astrology101-companion"
