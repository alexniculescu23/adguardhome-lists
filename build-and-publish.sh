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

echo "=== AdGuardHome merged list build/publish ==="

if [ ! -f "$SOURCES_FILE" ]; then
  echo "ERROR: missing $SOURCES_FILE"
  exit 1
fi

command -v node >/dev/null || { echo "ERROR: node not found"; exit 1; }
command -v hostlist-compiler >/dev/null || { echo "ERROR: hostlist-compiler not found"; exit 1; }
command -v git >/dev/null || { echo "ERROR: git not found"; exit 1; }
command -v python3 >/dev/null || { echo "ERROR: python3 not found"; exit 1; }

echo "=== Removing old local generated artifacts ==="
rm -rf downloads dist reports
mkdir -p downloads dist reports public

echo "=== Removing obsolete source profiles ==="
rm -f sources.full.json sources.medium.json

echo "=== Cleaning old public generated files ==="
find public -maxdepth 1 -type f \
  \( -name 'adguardhome-merged*.txt' \
     -o -name 'adguardhome-merged*.md' \
     -o -name 'adguardhome-merged*.json' \
     -o -name 'adguardhome-merged*.sha256*' \
     -o -name 'adguardhome-merged*.lines*' \
     -o -name 'adguardhome-merged*.meta*' \) \
  -delete

echo "=== Validating sources.json ==="
python3 -m json.tool "$SOURCES_FILE" >/dev/null

echo "=== Building merged list ==="
node build-merged-report.mjs

if [ ! -f "$MERGED_FILE" ]; then
  echo "ERROR: expected merged file not found: $MERGED_FILE"
  exit 1
fi

if [ ! -f "$REPORT_FILE" ]; then
  echo "ERROR: expected report file not found: $REPORT_FILE"
  exit 1
fi

echo "=== Publishing stable public files ==="
cp "$MERGED_FILE" "$PUBLIC_LIST"
cp "$REPORT_FILE" "$PUBLIC_REPORT"

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

echo
echo "=== List usefulness summary ==="
grep -E '^### |Unique domains contributed|Overlap with other lists' "$PUBLIC_REPORT" | head -160 || true

echo
echo "=== Removing local generated artifacts after publishing ==="
rm -rf downloads dist reports

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
  echo "  git config --local user.email \"YOUR_GITHUB_EMAIL\""
  exit 2
fi

echo
echo "=== Git add/commit/push ==="

git rm -f --ignore-unmatch sources.full.json sources.medium.json >/dev/null 2>&1 || true
git rm -r --cached --ignore-unmatch downloads dist reports >/dev/null 2>&1 || true

git add .gitignore
[ -f README.md ] && git add README.md
git add build-merged-report.mjs
git add build-and-publish.sh
git add sources.json
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
echo
echo "Latest report:"
echo "https://raw.githubusercontent.com/alexniculescu23/adguardhome-lists/main/public/adguardhome-merged.report.md"
