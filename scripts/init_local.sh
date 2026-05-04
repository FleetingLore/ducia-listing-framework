#!/usr/bin/env bash
set -euo pipefail
# scripts/init_local.sh — create local config from example and create logs dir

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
EXAMPLE="$ROOT_DIR/scripts/deploy.conf.example"
TARGET="$ROOT_DIR/scripts/deploy.conf"

if [ -f "$TARGET" ]; then
  echo "$TARGET already exists"
else
  if [ -f "$EXAMPLE" ]; then
    cp "$EXAMPLE" "$TARGET"
    echo "Created $TARGET from example. Edit values inside as needed."
  else
    echo "Example config $EXAMPLE not found."
  fi
fi

mkdir -p "$ROOT_DIR/logs"
echo "Created logs/ and ensured scripts/deploy.conf exists."
