# 简介

**Ducia Listing Framework** 是一个轻量级、插件化的文档管理系统。

## 设计理念

- **框架本体极简**：只定义接口契约，不绑定具体实现
- **一切皆插件**：存储、认证、可见性——通过插件注入
- **零硬编码**：所有字符串从语言包资源文件加载
- **动态角色**：不预设 admin/editor/viewer，部署者自定义

## 技术栈

| 层 | 技术 |
|----|------|
| 后端 | Rust + Actix-web 4 |
| 前端 | React 18 + TypeScript + Vite |
| 数据库（可选） | SQLite (rusqlite) |
| 身份认证 | JWT + bcrypt（内置），或外部服务 |
| 文档渲染 | pulldown-cmark (WASM) / react-markdown |
| 国际化 | JSON 语言包 + 请求级语言解析 |
| 构建工具 | Cargo + npm + wasm-pack |

## 项目结构

```mermaid
flowchart TB
    ROOT["ducia-listing-framework/"]

    ROOT --> CONFIG
    ROOT --> BACKEND
    ROOT --> SRC
    ROOT --> BOOK

    subgraph CONFIG["config/ 所有配置文件"]
        direction TB
        cf1["auth.json — JWT 密钥"]
        cf2["roles.json — 动态角色定义"]
        cf3["sequence.json — 序列码"]
        cf4["settings.json — 功能开关"]
        cf5["i18n/ — 语言资源文件"]
    end

    subgraph BACKEND["backend/"]
        direction TB
        be1["ducia-core/ — 框架核心（trait 定义）"]
        be2["server/ — 二进制入口"]
        be3["wasm/ — WASM 共享逻辑"]
        subgraph PLUGINS["plugins/ 官方插件"]
            direction LR
            pl1["auth-simple — 序列码认证"]
            pl2["auth-db — JWT + 数据库认证"]
            pl3["storage-fs — 文件系统存储"]
            pl4["storage-sqlite — SQLite 存储"]
        end
    end

    subgraph SRC["src/ 前端源码"]
        direction LR
        sr1["types/ — TypeScript 类型"]
        sr2["hooks/ — React Hooks"]
        sr3["components/ — UI 组件"]
        sr4["pages/ — 页面"]
    end

    subgraph BOOK["book/ 本书源码"]
        bk1["本书源码"]
    end
```
