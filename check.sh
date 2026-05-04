#!/bin/bash

echo "=== Ducia 项目健康检查 ==="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
PASS=0
FAIL=0
WARN=0

# 检查函数
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAIL++))
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $2 (缺失: $1)"
        ((FAIL++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $2 (缺失目录)"
        ((FAIL++))
    fi
}

# ========== 1. 配置文件检查 ==========
echo "【1. 配置文件】"
check_file "config/site.json" "config/site.json 存在"
check_file "config/settings.json" "config/settings.json 存在"
check_file "config/docs.json" "config/docs.json 存在"
check_file "config/sequence.json" "config/sequence.json 存在"
echo ""

# ========== 2. 后端检查 ==========
echo "【2. 后端 (Rust)】"
check_dir "backend/src" "backend/src 目录存在"
check_dir "backend/src/handlers" "backend/src/handlers 目录存在"
check_file "backend/Cargo.toml" "Cargo.toml 存在"
check_file "backend/src/main.rs" "main.rs 存在"
check_file "backend/src/models.rs" "models.rs 存在"
check_file "backend/src/config.rs" "config.rs 存在"
check_file "backend/src/db.rs" "db.rs 存在"
check_file "backend/src/handlers/mod.rs" "handlers/mod.rs 存在"
check_file "backend/src/handlers/list.rs" "handlers/list.rs 存在"
check_file "backend/src/handlers/get.rs" "handlers/get.rs 存在"
check_file "backend/src/handlers/upload.rs" "handlers/upload.rs 存在"
check_file "backend/src/handlers/deprecated.rs" "handlers/deprecated.rs 存在"
check_file "backend/src/handlers/delete.rs" "handlers/delete.rs 存在"
check_file "backend/src/handlers/admin.rs" "handlers/admin.rs 存在"
echo ""

# ========== 3. 前端检查 ==========
echo "【3. 前端 (React)】"
check_dir "src" "src 目录存在"
check_dir "src/components" "src/components 目录存在"
check_dir "src/pages" "src/pages 目录存在"
check_dir "src/hooks" "src/hooks 目录存在"
check_dir "src/utils" "src/utils 目录存在"
check_dir "src/styles" "src/styles 目录存在"
check_file "src/App.jsx" "App.jsx 存在"
check_file "src/main.jsx" "main.jsx 存在"
check_file "index.html" "index.html 存在"
check_file "vite.config.js" "vite.config.js 存在"
check_file "package.json" "package.json 存在"
echo ""

# ========== 4. 组件文件检查 ==========
echo "【4. 组件文件】"
check_file "src/components/Header.jsx" "Header.jsx 存在"
check_file "src/components/DocItem.jsx" "DocItem.jsx 存在"
check_file "src/components/DocHeader.jsx" "DocHeader.jsx 存在"
check_file "src/components/DocFooter.jsx" "DocFooter.jsx 存在"
check_file "src/components/DeprecatedBanner.jsx" "DeprecatedBanner.jsx 存在"
echo ""

# ========== 5. 页面文件检查 ==========
echo "【5. 页面文件】"
check_file "src/pages/Listing.jsx" "Listing.jsx 存在"
check_file "src/pages/DocPage.jsx" "DocPage.jsx 存在"
check_file "src/pages/AdminPage.jsx" "AdminPage.jsx 存在"
echo ""

# ========== 6. Hooks 检查 ==========
echo "【6. Hooks】"
check_file "src/hooks/useAdmin.js" "useAdmin.js 存在"
check_file "src/hooks/useCats.js" "useCats.js 存在"
check_file "src/hooks/useDoc.js" "useDoc.js 存在"
check_file "src/hooks/useUpload.js" "useUpload.js 存在"
echo ""

# ========== 7. 样式文件检查 ==========
echo "【7. 样式文件】"
check_file "src/styles/global.css" "global.css 存在"
check_file "src/styles/layout.css" "layout.css 存在"
check_file "src/styles/list.css" "list.css 存在"
check_file "src/styles/markdown.css" "markdown.css 存在"
check_file "src/styles/footer.css" "footer.css 存在"
check_file "src/styles/admin.css" "admin.css 存在"
echo ""

# ========== 8. 图标检查 ==========
echo "【8. 图标 (public/icons/)】"
check_dir "public/icons" "public/icons 目录存在"
check_file "public/icons/home.svg" "home.svg 存在"
check_file "public/icons/user.svg" "user.svg 存在"
check_file "public/icons/upload.svg" "upload.svg 存在"
check_file "public/icons/download.svg" "download.svg 存在"
echo ""

# ========== 9. 文档目录检查 ==========
echo "【9. 文档目录】"
check_dir "docs" "docs 目录存在"
echo ""

# ========== 10. 依赖检查 ==========
echo "【10. 依赖检查】"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules 已安装"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} node_modules 未安装 (运行 npm install)"
    ((WARN++))
fi

if [ -d "backend/target" ]; then
    echo -e "${GREEN}✓${NC} backend/target 已编译"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} backend/target 未编译 (运行 cd backend && cargo build)"
    ((WARN++))
fi
echo ""

# ========== 11. 端口检查 ==========
echo "【11. 服务运行状态】"
if lsof -i :3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 后端服务运行在端口 3001"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} 后端未运行 (cd backend && cargo run)"
    ((WARN++))
fi

if lsof -i :5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} 前端服务运行在端口 5173"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} 前端未运行 (npm run dev 或 npx vite)"
    ((WARN++))
fi
echo ""

# ========== 总结 ==========
echo "=========================================="
echo "检查完成: ${GREEN}通过 ${PASS}${NC} / ${RED}失败 ${FAIL}${NC} / ${YELLOW}警告 ${WARN}${NC}"
echo "=========================================="

if [ $FAIL -gt 0 ]; then
    echo ""
    echo "⚠️ 发现缺失文件，请根据上面的提示创建"
    exit 1
else
    echo ""
    echo "✅ 所有核心文件都存在！"
    if [ $WARN -gt 0 ]; then
        echo "⚠️ 请处理上述警告"
    else
        echo "🎉 项目完整，可以运行！"
    fi
    exit 0
fi
