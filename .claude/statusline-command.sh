#!/bin/bash

# Read JSON input from stdin
input=$(cat)

# Extract values from JSON
model_name=$(echo "$input" | jq -r '.model.display_name')
current_dir=$(echo "$input" | jq -r '.workspace.current_dir')
project_dir=$(echo "$input" | jq -r '.workspace.project_dir')

# Get abbreviated directory path
if [[ "$current_dir" == "$project_dir" ]]; then
  dir_display=$(basename "$current_dir")
else
  # Show relative path from project
  rel_path=${current_dir#$project_dir/}
  proj_name=$(basename "$project_dir")
  dir_display="$proj_name/$rel_path"
fi

# Get git branch and status (skip locks for performance)
git_info=""
if git rev-parse --git-dir > /dev/null 2>&1; then
  branch=$(git -c core.useBuiltinFSMonitor=false branch --show-current 2>/dev/null || echo "detached")

  # Check for uncommitted changes (quick check)
  if ! git -c core.useBuiltinFSMonitor=false diff-index --quiet HEAD -- 2>/dev/null; then
    status="*"
  else
    status=""
  fi

  git_info=" $(printf '\033[38;5;140m')on $(printf '\033[38;5;183m')$branch$status$(printf '\033[0m')"
fi

# Build status line with Warp-style formatting
printf "$(printf '\033[38;5;117m')$dir_display$(printf '\033[0m')$git_info $(printf '\033[2m')│$(printf '\033[0m') $(printf '\033[38;5;150m')$model_name$(printf '\033[0m')"
