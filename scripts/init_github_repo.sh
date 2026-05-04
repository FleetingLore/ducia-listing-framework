#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/init_github_repo.sh
# This script initializes a local git repo, creates the GitHub repository using `gh`,
# and pushes the current code to `main`.

REPO_OWNER="FleetingLore"
REPO_NAME="ducia-listing-framework"

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is not installed. Install it or create the repository manually on GitHub."
  exit 1
fi

if [ -d .git ]; then
  echo "Repository already initialized locally. Ensuring branch 'main' is checked out."
  git checkout -B main || true
else
  git init
  git checkout -B main
  git add -A
  git commit -m "Initial commit: prepare repo for ducia-listing-framework"
fi

# Create the repo under the specified owner. Requires gh authenticated user to have permission.
echo "Creating repository ${REPO_OWNER}/${REPO_NAME}..."
gh repo create "${REPO_OWNER}/${REPO_NAME}" --public --source=. --remote=origin --confirm --push || {
  echo "Failed to create or push to remote via gh. Check permissions or create repo manually.";
  exit 1;
}

echo "Repository created and pushed."
