#!/usr/bin/env bash
set -euo pipefail
# scripts/run-dev.sh — start backend (in background) and frontend (dev server)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p logs

trap 'echo "Stopping dev processes..."; if [ -f "$ROOT_DIR/.dev_backend.pid" ]; then kill "$(cat $ROOT_DIR/.dev_backend.pid)" 2>/dev/null || true; rm -f "$ROOT_DIR/.dev_backend.pid"; fi; exit' INT TERM EXIT

if ! command -v cargo >/dev/null 2>&1; then
  echo "cargo not found — install Rust (https://rustup.rs/)"
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "npm not found — install Node.js (https://nodejs.org/)"
  exit 1
fi

echo "Starting backend (cargo run) — logs => logs/backend.log"
cd backend
cargo run > "$ROOT_DIR/logs/backend.log" 2>&1 &
echo $! > "$ROOT_DIR/.dev_backend.pid"
cd "$ROOT_DIR"

echo "Starting frontend (npm run dev)"
npm run dev

# When npm dev exits, trap will kill backend
