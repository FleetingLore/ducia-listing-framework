#!/usr/bin/env bash
set -euo pipefail
# scripts/stop-dev.sh — stop backend started by run-dev.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
if [ -f "$ROOT_DIR/.dev_backend.pid" ]; then
  PID=$(cat "$ROOT_DIR/.dev_backend.pid")
  echo "Stopping backend (pid: $PID)"
  kill "$PID" 2>/dev/null || true
  rm -f "$ROOT_DIR/.dev_backend.pid"
  echo "Stopped."
else
  echo "No .dev_backend.pid found — backend may not be running or started differently."
fi
