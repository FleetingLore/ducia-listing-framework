#!/bin/bash
# 本地部署脚本 - 支持更新文档

SERVER="175.178.183.209"
DOCS_SYNC=${1:-"no"}  # 第一个参数: "docs" 表示同步文档

echo "=========================================="
echo "  部署 Ducia 到服务器"
echo "=========================================="

# 1. 构建前端
echo "[1/4] 构建前端..."
npm run build

# 2. 确定打包内容
echo "[2/4] 打包文件..."
EXCLUDE="--exclude=node_modules --exclude=.git --exclude=config/docs.json"

if [ "$DOCS_SYNC" = "docs" ]; then
    echo "  📁 包含文档目录（将覆盖服务器上的文档）"
    EXCLUDE="$EXCLUDE --exclude=docs"
    INCLUDE_DOCS=""
else
    echo "  📁 排除文档目录（保留服务器上的文档）"
    INCLUDE_DOCS="--exclude=docs"
fi

tar -czf /tmp/ducia-deploy.tar.gz \
    $EXCLUDE $INCLUDE_DOCS \
    dist/ src/ public/ index.html package.json package-lock.json vite.config.js backend/

# 3. 上传
echo "[3/4] 上传到服务器..."
scp /tmp/ducia-deploy.tar.gz root@$SERVER:/tmp/

# 4. 服务器端更新
echo "[4/4] 服务器端更新..."
ssh root@$SERVER << 'ENDSSH'
    cd /root/ducia-local
    
    # 备份当前 docs.json
    cp config/docs.json /tmp/docs.json.bak 2>/dev/null || true
    
    # 解压
    tar -xzf /tmp/ducia-deploy.tar.gz --overwrite
    
    # 恢复 docs.json（除非是全新部署）
    if [ -f /tmp/docs.json.bak ]; then
        mv /tmp/docs.json.bak config/docs.json
    fi
    
    # 创建必要目录
    mkdir -p docs
    
    # 重新编译后端
    cd backend
    cargo build --release 2>/dev/null || cargo build --release
    
    # 重启服务
    pkill -f "release/ducia" 2>/dev/null || true
    nohup ./target/release/ducia > /dev/null 2>&1 &
    
    # 清理
    rm /tmp/ducia-deploy.tar.gz
    
    echo "部署完成！"
ENDSSH

echo ""
echo "✅ 部署完成！"
echo "   访问: http://local.ducia.site"
echo ""
echo "💡 提示:"
echo "   只更新代码: ./deploy.sh"
echo "   同时更新文档: ./deploy.sh docs"