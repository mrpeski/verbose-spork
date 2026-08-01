#!/usr/bin/env bash

# Build the portfolio and publish it to GitHub Pages (gh-pages branch).
# Usage: ./deploy.sh [theme]   (theme defaults to "light", same as portfolio.sh)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
THEME="${1:-light}"

cd "$ROOT"
bash portfolio.sh "$THEME"

REMOTE_URL="$(git remote get-url origin)"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

cp -R "$ROOT/portfolio/." "$TMP/"
touch "$TMP/.nojekyll"

git -C "$TMP" init -q -b gh-pages
git -C "$TMP" add -A
git -C "$TMP" commit -qm "Deploy portfolio (theme: $THEME)"
git -C "$TMP" -c credential.helper='!gh auth git-credential' push -f "$REMOTE_URL" gh-pages:gh-pages

echo "Pushed to gh-pages. Site: https://mrpeski.github.io/verbose-spork/"
