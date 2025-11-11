#!/bin/bash

# ========================================
# GitHub 仓库创建和推送脚本
# ========================================

set -e

echo "🚀 开始部署到 GitHub..."
echo ""

# 检查 Git 是否已初始化
if [ ! -d ".git" ]; then
    echo "❌ 错误: Git 未初始化"
    echo "请先运行: git init"
    exit 1
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到未提交的更改"
    read -p "是否现在提交这些更改? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git add .
        git commit -m "chore: prepare for deployment"
    fi
fi

# 检查远程仓库
if git remote | grep -q "^origin$"; then
    echo "✅ 已配置远程仓库:"
    git remote -v
    echo ""
    read -p "是否使用现有远程仓库? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "请手动配置远程仓库:"
        echo "  git remote remove origin"
        echo "  git remote add origin https://github.com/你的用户名/crypto-indices-app.git"
        exit 0
    fi
else
    echo "📝 未检测到远程仓库"
    echo ""
    echo "请按照以下步骤操作:"
    echo ""
    echo "1. 访问 https://github.com/new"
    echo "2. 仓库名称: crypto-indices-app"
    echo "3. 描述: Real-time cryptocurrency indices dashboard with 30-day analysis"
    echo "4. 选择 Public"
    echo "5. 不要勾选 'Add README' 或 '.gitignore'"
    echo "6. 点击 'Create repository'"
    echo ""
    read -p "创建完成后，请输入你的 GitHub 用户名: " GITHUB_USERNAME
    
    if [ -z "$GITHUB_USERNAME" ]; then
        echo "❌ 用户名不能为空"
        exit 1
    fi
    
    echo ""
    echo "🔗 添加远程仓库..."
    git remote add origin "https://github.com/${GITHUB_USERNAME}/crypto-indices-app.git" || {
        echo "⚠️  远程仓库已存在，尝试更新..."
        git remote set-url origin "https://github.com/${GITHUB_USERNAME}/crypto-indices-app.git"
    }
fi

# 确保在 main 分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "📦 切换到 main 分支..."
    git branch -M main 2>/dev/null || git checkout -b main
fi

# 推送代码
echo ""
echo "📤 推送到 GitHub..."
echo ""

# 尝试推送
if git push -u origin main 2>&1; then
    echo ""
    echo "✅ 成功推送到 GitHub!"
    echo ""
    echo "🔗 你的仓库地址:"
    REMOTE_URL=$(git remote get-url origin)
    echo "   ${REMOTE_URL%.git}"
    echo ""
    echo "📋 下一步:"
    echo "   1. 访问上面的链接确认代码已上传"
    echo "   2. 按照 VERCEL_DEPLOYMENT.md 的步骤部署到 Vercel"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "可能的原因:"
    echo "  1. GitHub 仓库尚未创建"
    echo "  2. 认证失败（需要配置 GitHub 凭证）"
    echo "  3. 网络问题"
    echo ""
    echo "解决方案:"
    echo "  1. 确认已创建 GitHub 仓库"
    echo "  2. 配置 Git 凭证:"
    echo "     git config --global user.name '你的名字'"
    echo "     git config --global user.email '你的邮箱'"
    echo "  3. 使用 GitHub CLI 或 SSH 密钥进行认证"
    echo ""
    echo "手动推送命令:"
    echo "  git push -u origin main"
    echo ""
    exit 1
fi

