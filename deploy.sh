#!/usr/bin/env bash
set -euo pipefail
# deploy.sh - deploy project to remote server

# Load deployment config if present
CONF_FILE="scripts/deploy.conf"
if [ -f "$CONF_FILE" ]; then
  # shellcheck source=/dev/null
  . "$CONF_FILE"
fi

# Defaults (can be overridden in scripts/deploy.conf)
SERVER="${SERVER:-175.178.183.209}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_PATH="${REMOTE_PATH:-/root/ducia-local}"
SSH_PORT="${SSH_PORT:-22}"
DOCS_SYNC=${1:-"no"}

echo "=========================================="
echo "  部署 ducia-listing-framework 到服务器: $REMOTE_USER@$SERVER"
echo "=========================================="

echo "[1/4] 构建前端..."
npm run build

echo "[2/4] 打包文件..."
EXCLUDE="--exclude=node_modules --exclude=.git --exclude=config/docs.json"

if [ "$DOCS_SYNC" = "docs" ]; then
    echo "包含文档目录（将覆盖服务器上的文档）"
    INCLUDE_DOCS="docs"
else
    echo "排除文档目录（保留服务器上的文档）"
    INCLUDE_DOCS=""
fi

TMP_TAR="/tmp/ducia-deploy.tar.gz"
tar -czf "$TMP_TAR" \
    $EXCLUDE \
    dist/ src/ public/ index.html package.json package-lock.json vite.config.js backend/ ${INCLUDE_DOCS}

echo "[3/4] 上传到服务器..."
scp -P "$SSH_PORT" "$TMP_TAR" "$REMOTE_USER@$SERVER:/tmp/"

echo "[4/4] 服务器端更新..."
ssh -p "$SSH_PORT" "$REMOTE_USER@$SERVER" << EOF
set -euo pipefail
cd "$REMOTE_PATH"

cp config/docs.json /tmp/docs.json.bak 2>/dev/null || true

tar -xzf /tmp/ducia-deploy.tar.gz --overwrite

if [ -f /tmp/docs.json.bak ]; then
    mv /tmp/docs.json.bak config/docs.json
fi

mkdir -p docs

cd backend
cargo build --release 2>/dev/null || cargo build --release

# Determine binary name from Cargo metadata or Cargo.toml
BIN_NAME=""
if command -v cargo >/dev/null 2>&1 && command -v python3 >/dev/null 2>&1; then
    BIN_NAME=\$(cargo metadata --no-deps --format-version 1 | python3 -c 'import sys,json;print(json.load(sys.stdin)["packages"][0]["name"])')
fi
if [ -z "\$BIN_NAME" ]; then
    BIN_NAME=\$(grep -E '^name\s*=\s*"' Cargo.toml | head -n1 | sed -E 's/name\s*=\s*"(.*)"/\1/')
fi

# Stop previous instance if any and start new one
pkill -f "\$BIN_NAME" 2>/dev/null || true
nohup ./target/release/"\$BIN_NAME" > /dev/null 2>&1 &

# 清理临时文件
rm /tmp/ducia-deploy.tar.gz || true

EOF