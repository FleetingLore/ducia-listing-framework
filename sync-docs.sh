#!/bin/bash
# 同步本地 docs 目录到服务器

SERVER="175.178.183.209"

echo "=========================================="
echo "  同步文档到服务器"
echo "=========================================="

# 检查本地 docs 目录
if [ ! -d "docs" ]; then
    echo "❌ 本地 docs 目录不存在"
    exit 1
fi

# 统计文件
DOC_COUNT=$(find docs -name "*.md" -type f | wc -l | tr -d ' ')
echo "📁 本地文档数量: $DOC_COUNT"

# 同步文档（保留服务器上的 docs.json）
echo "🔄 同步中..."
rsync -avz --delete \
    --exclude='.DS_Store' \
    docs/ root@$SERVER:/root/ducia-local/docs/

# 同步 docs.json（保留服务器上的 IDs）
echo "📋 同步文档映射..."
scp config/docs.json root@$SERVER:/tmp/docs.new.json
ssh root@$SERVER << 'ENDSSH'
    cd /root/ducia-local
    
    # 合并文档映射（保留已有 ID）
    python3 << 'PYTHON'
import json
import os

# 读取现有映射
old_path = "config/docs.json"
new_path = "/tmp/docs.new.json"

old = {}
if os.path.exists(old_path):
    with open(old_path) as f:
        old = json.load(f)

with open(new_path) as f:
    new = json.load(f)

# 合并：新文件覆盖旧文件，但保留旧文件的 next_id
if "next_id" in new:
    old["next_id"] = max(old.get("next_id", 1), new["next_id"])
old["docs"].update(new["docs"])

with open(old_path, "w") as f:
    json.dump(old, f, indent=2, ensure_ascii=False)

print("文档映射合并完成")
PYTHON
    rm /tmp/docs.new.json
    chown -R root:root docs config/docs.json
    echo "文档同步完成"
ENDSSH

echo ""
echo "✅ 同步完成！"
echo "   服务器文档已更新"
echo "   💡 运行 ./deploy.sh 重启服务"
