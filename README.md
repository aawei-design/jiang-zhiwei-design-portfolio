# 蒋志伟·视觉设计作品集

基于 React + Vite 的个人作品集网站基础版。

当前版本采用“项目索引 + 长案例 + 作品归档墙”的展示结构，包含米影视 VIP、Mihome IP、OTT 动态与 AI 设计工作流。

## 本地运行

```bash
pnpm install
pnpm dev
```

默认开发地址为 `http://localhost:5173`。

## 构建

```bash
pnpm build
pnpm preview
```

## GitHub Pages 发布

仓库已包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 分支后，GitHub Actions 会自动执行 `pnpm run build:pages`，并将当前 Masonry 作品集发布为站点首页。

首次发布时，在 GitHub 仓库的 `Settings → Pages` 中，将 `Source` 设为 `GitHub Actions`。之后每次推送都会自动更新线上页面。

## 素材说明

- `public/assets/profile.jpg` 来自简历中的本人证件照。
- `public/assets/hero-background.mp4` 为 Pexels CC0 动态背景，来源：Pixabay / Pexels。
- 当前项目封面为首版使用的程序化概念视觉，等后续收到真实作品素材后替换。
