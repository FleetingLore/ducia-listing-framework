#!/usr/bin/env bash
set -euo pipefail

CONF_FILE="scripts/deploy.conf"
if [ -f "$CONF_FILE" ]; then
  . "$CONF_FILE"
fi

SERVER="${SERVER:-175.178.183.209}"
REMOTE_USER="${REMOTE_USER:-root}"
REMOTE_PATH="${REMOTE_PATH:-/www/wwwroot/ducia}"
SSH_PORT="${SSH_PORT:-22}"
DOCS_SYNC=${1:-"no"}

BIN_NAME="ducia"

echo "=========================================="
echo "  部署到: $REMOTE_USER@$SERVER:$REMOTE_PATH"
echo "=========================================="

# 1. 构建前端（先清理旧构建）
echo "[1/5] 构建前端..."
rm -rf dist
npm run build

# 2. 打包
echo "[2/5] 打包文件..."
EXCLUDE="--exclude=node_modules --exclude=.git --exclude=config/docs.json"

if [ "$DOCS_SYNC" = "docs" ]; then
    echo "  📁 包含文档目录（将覆盖服务器文档）"
    TAR_EXTRA=""
else
    echo "  📁 排除文档目录（保留服务器文档）"
    TAR_EXTRA="--exclude=docs"
fi

TMP_TAR="/tmp/ducia-deploy.tar.gz"
tar -czf "$TMP_TAR" \
    $EXCLUDE $TAR_EXTRA \
    dist/ src/ public/ index.html package.json package-lock.json vite.config.js backend/

# 3. 上传
echo "[3/5] 上传到服务器..."
scp -P "$SSH_PORT" "$TMP_TAR" "$REMOTE_USER@$SERVER:/tmp/"

# 4. 服务器端更新
echo "[4/5] 服务器端更新..."
ssh -p "$SSH_PORT" "$REMOTE_USER@$SERVER" << 'ENDSSH'
    set -e
    REMOTE_PATH="/www/wwwroot/ducia"
    BIN_NAME="ducia"
    
    cd "$REMOTE_PATH"
    
    # 删除旧的 dist 目录（强制刷新）
    rm -rf dist
    
    # 备份 docs.json
    if [ -f config/docs.json ]; then
        cp config/docs.json /tmp/docs.json.bak
    fi
    
    # 解压
    tar -xzf /tmp/ducia-deploy.tar.gz --overwrite
    
    # 恢复 docs.json
    if [ -f /tmp/docs.json.bak ]; then
        mv /tmp/docs.json.bak config/docs.json
    fi
    
    mkdir -p docs
    
    # 编译后端
    echo "  编译后端..."
    cd backend
    cargo build --release --quiet 2>/dev/null || cargo build --release
    
    # 停止旧进程
    pkill -f "$BIN_NAME" 2>/dev/null || true
    sleep 1
    
    # 启动新进程
    nohup ./target/release/"$BIN_NAME" > /tmp/ducia.log 2>&1 &
    
    rm -f /tmp/ducia-deploy.tar.gz
    
    echo "  后端已启动"
ENDSSH

# 5. 重载 Nginx 并清除缓存
echo "[5/5] 重载 Nginx..."
ssh -p "$SSH_PORT" "$REMOTE_USER@$SERVER" << 'ENDSSH'
    # 重载 Nginx
    nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true
    
    # 删除 Nginx 缓存目录（如果有）
    rm -rf /www/wwwroot/ducia/dist/.vite 2>/dev/null || true
    rm -rf /var/cache/nginx/* 2>/dev/null || true
    
    echo "  Nginx 已重载"
ENDSSH

echo ""
echo "✅ 部署完成！"
echo "   访问: http://local.ducia.site"
echo ""
echo "💡 如果还是旧内容，请："
echo "   1. 浏览器硬刷新: Cmd+Shift+R (Mac) 或 Ctrl+Shift+R (Windows)"
echo "   2. 清除浏览器缓存"
echo "   3. 或使用无痕模式测试"
