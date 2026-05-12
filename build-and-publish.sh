#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

REPO_URL="https://github.com/alexniculescu23/adguardhome-lists.git"

SOURCES_FILE="sources.json"
MERGED_FILE="dist/merged-latest.txt"
REPORT_FILE="reports/latest.md"

PUBLIC_LIST="public/adguardhome-merged.txt"
PUBLIC_META="public/adguardhome-merged.meta.txt"
PUBLIC_SHA="public/adguardhome-merged.sha256.txt"
PUBLIC_LINES="public/adguardhome-merged.lines.txt"
PUBLIC_REPORT="public/adguardhome-merged.report.md"

if [ ! -f "$SOURCES_FILE" ]; then
  echo "ERROR: missing $SOURCES_FILE"
  exit 1
fi

command -v node >/dev/null || { echo "ERROR: node not found"; exit 1; }
command -v hostlist-compiler >/dev/null || { echo "ERROR: hostlist-compiler not found"; exit 1; }
command -v git >/dev/null || { echo "ERROR: git not found"; exit 1; }

mkdir -p public dist reports downloads

echo "=== Building merged FULL list ==="
node build-merged-report.mjs

if [ ! -f "$MERGED_FILE" ]; then
  echo "ERROR: expected merged file not found: $MERGED_FILE"
  exit 1
fi

echo "=== Publishing stable public file ==="
cp "$MERGED_FILE" "$PUBLIC_LIST"

if [ -f "$REPORT_FILE" ]; then
  cp "$REPORT_FILE" "$PUBLIC_REPORT"
fi

{
  echo "compiled_at_utc=$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  echo "profile=full"
  echo "sources_file=$SOURCES_FILE"
  echo "merged_source=$MERGED_FILE"
  echo "bytes=$(wc -c < "$PUBLIC_LIST")"
  echo "lines=$(wc -l < "$PUBLIC_LIST")"
  echo "sha256=$(sha256sum "$PUBLIC_LIST" | awk '{print $1}')"
} > "$PUBLIC_META"

sha256sum "$PUBLIC_LIST" > "$PUBLIC_SHA"
wc -l "$PUBLIC_LIST" > "$PUBLIC_LINES"

echo
echo "=== Public metadata ==="
cat "$PUBLIC_META"

if [ -f "$PUBLIC_REPORT" ]; then
  echo
  echo "=== Latest list usefulness report ==="
  sed -n '1,80p' "$PUBLIC_REPORT"
fi

echo
echo "=== Git remote ==="
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REPO_URL"
else
  git remote set-url origin "$REPO_URL"
fi

git branch -M main

echo
echo "=== Git identity used by this repo ==="
echo "user.name=$(git config --get user.name || true)"
echo "user.email=$(git config --get user.email || true)"

if [ -z "$(git config --get user.name || true)" ] || [ -z "$(git config --get user.email || true)" ]; then
  echo
  echo "ERROR: Git user.name/user.email not configured for this repo/effective config."
  echo "Set local-only identity, for example:"
  echo "  git config --local user.name \"Alex Niculescu\""
  echo "  git config --local user.email \"alexniculescu23@users.noreply.github.com\""
  exit 2
fi

echo
echo "=== Git add/commit/push ==="
git add .gitignore
git add build-merged-report.mjs
git add sources.json
git add build-and-publish.sh
git add public/

if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "Update AdGuardHome merged list"
fi

git push -u origin main

echo
echo "DONE."
echo "Use this URL in AdGuardHome:"
echo "https://raw.githubusercontent.com/alexniculescu23/adguardhome-lists/main/public/adguardhome-merged.txt"
