#!/bin/bash

set -e

echo "=========================================="
echo "  Ducia 更新脚本"
echo "=========================================="

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 项目路径
PROJECT_DIR="/root/ducia-local"
WWW_DIR="/www/wwwroot/ducia"
BACKEND_DIR="$WWW_DIR/backend"

# 1. 停止服务
echo -e "${YELLOW}[1/6] 停止当前服务...${NC}"
pkill -f "release/ducia" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# 2. 拉取最新代码（如果使用 git）
# echo -e "${YELLOW}[2/6] 拉取最新代码...${NC}"
# cd $PROJECT_DIR && git pull

# 3. 构建前端
echo -e "${YELLOW}[2/6] 构建前端...${NC}"
cd $PROJECT_DIR
npm install
npm run build

# 4. 复制前端文件
echo -e "${YELLOW}[3/6] 复制前端文件到网站目录...${NC}"
cp -r dist/* $WWW_DIR/dist/

# 5. 编译后端
echo -e "${YELLOW}[4/6] 编译后端...${NC}"
cd $BACKEND_DIR
cargo build --release

# 6. 启动服务
echo -e "${YELLOW}[5/6] 启动服务...${NC}"
cd $BACKEND_DIR
nohup ./target/release/ducia > /dev/null 2>&1 &
echo -e "${GREEN}  后端已启动 (PID: $!)${NC}"

# 7. 重载 Nginx
echo -e "${YELLOW}[6/6] 重载 Nginx...${NC}"
nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true

echo -e "${GREEN}=========================================="
echo -e "  更新完成！"
echo -e "  访问: http://local.ducia.site"
echo -e "==========================================${NC}"
