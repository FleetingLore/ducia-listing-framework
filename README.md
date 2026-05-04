# ducia-listing-framework — Fullstack Docs Template

这是一个包含 Rust 后端（Actix-web）和前端（Vite + React）的示例工程，已准备为 GitHub 模板仓库与可发布的 Rust crate（后端）使用。

使用为 GitHub 模板

- 在 GitHub 上选择仓库设置并启用 "Template repository"（Enable as template）。
- 点击 "Use this template" 可以基于本仓库快速创建新项目。

发布到 GitHub 并用 Rust 文档作为站点

1. 如果你想把仓库发布到 GitHub（建议先在本地确认一切工作正常）：

	 - 首先安装并登录 GitHub CLI（可选，但推荐）：

		 ```bash
		 gh auth login
		 ```

	 - 使用我们的辅助脚本来创建仓库并推送：

		 ```bash
		 ./scripts/init_github_repo.sh
		 ```

	 - 脚本会在 `FleetingLore/ducia-listing-framework` 下创建仓库（需要你的 GitHub 账户有对应权限），并把当前代码推到 `main` 分支。

2. GitHub Actions 已配置为在每次 push 到 `main` 时构建 `backend` 的 Rust 文档并将 `backend/target/doc` 发布到 `gh-pages` 分支：

	 - 工作流文件： [.github/workflows/publish-docs.yml](.github/workflows/publish-docs.yml#L1)
	 - CI 使用 `cargo doc` 生成文档并通过 `peaceiris/actions-gh-pages` 发布到 `gh-pages`。

3. 在仓库的 GitHub 页面，打开 Settings → Pages，设置 Source 为 `gh-pages` 分支（工作流运行后会自动创建并推送内容）。


包含内容

- `backend/`：Rust 后端（可作为库发布到 crates.io，或以二进制运行）。
- `src/` 与 `public/`：前端代码（Vite + React）。
- `config/`、`docs/`：默认配置与示例文档。

发布后端到 crates.io（要点）

1. 在 `backend/Cargo.toml` 中填写 `description`、`license`、`readme`、`repository` 等元数据。
2. 在 `backend/` 目录下运行 `cargo publish`（需要有效的 crates.io token）。

注意：GitHub 模板的开关需要在 GitHub 界面上手动启用。
