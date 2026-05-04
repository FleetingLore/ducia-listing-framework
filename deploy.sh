#!/bin/bash
# 本地部署脚本 - 保留已有文档

SERVER="175.178.183.209"
echo "=========================================="
echo "  部署 Ducia 到服务器（保留文档）"
echo "=========================================="

# 1. 构建前端
echo "[1/4] 构建前端..."
npm run build

# 2. 打包（排除 docs 和 config/docs.json）
echo "[2/4] 打包文件..."
tar -czf /tmp/ducia-deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=docs \
    --exclude=config/docs.json \
    dist/ src/ public/ index.html package.json package-lock.json vite.config.js backend/

# 3. 上传
echo "[3/4] 上传到服务器..."
scp /tmp/ducia-deploy.tar.gz root@$SERVER:/tmp/

# 4. 服务器端更新（保留文档）
echo "[4/4] 服务器端更新..."
ssh root@$SERVER << 'ENDSSH'
    cd /root/ducia-local
    
    # 备份当前的 docs.json（如果有新文档）
    if [ -f config/docs.json ]; then
        cp config/docs.json /tmp/docs.json.bak
    fi
    
    # 解压（不覆盖 docs 目录）
    tar -xzf /tmp/ducia-deploy.tar.gz --overwrite
    
    # 恢复 docs.json（如果有备份）
    if [ -f /tmp/docs.json.bak ]; then
        mv /tmp/docs.json.bak config/docs.json
    fi
    
    # 确保 docs 目录存在
    mkdir -p docs
    
    # 重新编译后端
    cd backend
    cargo build --release
    
    # 重启服务
    pkill -f "release/ducia" 2>/dev/null || true
    nohup ./target/release/ducia > /dev/null 2>&1 &
    
    # 清理
    rm /tmp/ducia-deploy.tar.gz
    
    echo "部署完成！文档已保留"
ENDSSH

echo ""
echo "✅ 部署完成！访问: http://local.ducia.site"
echo "📁 已有文档已保留，不会被删除"