#!/usr/bin/env bash

# Enhanced status line for Claude Code
# Shows: Project | Git branch | Changes | Last commit time

# Get project name
PROJECT=$(basename "$PWD")

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo "📁 $PROJECT (not a git repo)"
  exit 0
fi

# Get git branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)

# Count changed files
MODIFIED=$(git diff --name-only 2>/dev/null | wc -l)
STAGED=$(git diff --cached --name-only 2>/dev/null | wc -l)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null | wc -l)

# Calculate total changes
TOTAL_CHANGES=$((MODIFIED + STAGED + UNTRACKED))

# Get status icon and text
if [ $TOTAL_CHANGES -eq 0 ]; then
  STATUS_ICON="✓"
  CHANGES_TEXT="clean"
else
  STATUS_ICON="●"
  CHANGES_TEXT="${TOTAL_CHANGES} changes"

  # Break down changes if there are multiple types
  DETAILS=""
  [ $STAGED -gt 0 ] && DETAILS="${STAGED} staged"
  [ $MODIFIED -gt 0 ] && [ -n "$DETAILS" ] && DETAILS="$DETAILS, ${MODIFIED} modified" || [ $MODIFIED -gt 0 ] && DETAILS="${MODIFIED} modified"
  [ $UNTRACKED -gt 0 ] && [ -n "$DETAILS" ] && DETAILS="$DETAILS, ${UNTRACKED} new" || [ $UNTRACKED -gt 0 ] && DETAILS="${UNTRACKED} new"

  [ -n "$DETAILS" ] && CHANGES_TEXT="$DETAILS"
fi

# Get last commit time (relative)
LAST_COMMIT=$(git log -1 --format="%ar" 2>/dev/null)

# Output format: Project | branch status (changes) | last commit
echo "📦 $PROJECT | 🌿 $BRANCH $STATUS_ICON ($CHANGES_TEXT) | ⏱ $LAST_COMMIT"
