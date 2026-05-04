#!/bin/bash
# 从服务器拉取文档到本地

SERVER="175.178.183.209"

echo "=========================================="
echo "  从服务器拉取文档"
echo "=========================================="

# 创建目录
mkdir -p docs config

# 拉取文档文件
echo "📁 拉取 .md 文件..."
rsync -avz root@$SERVER:/root/ducia-local/docs/ docs/

# 拉取文档映射
echo "📋 拉取文档映射..."
scp root@$SERVER:/root/ducia-local/config/docs.json config/docs.json

# 统计
DOC_COUNT=$(find docs -name "*.md" -type f | wc -l | tr -d ' ')
echo ""
echo "✅ 拉取完成！本地文档数量: $DOC_COUNT"
