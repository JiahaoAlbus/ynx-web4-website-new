# YNX Web4 Website

这是 JiahaoAlbus/ynx-web4-website-new
核心文档来自 JiahaoAlbus/YNX

This is the official portal for the YNX Web4 public testnet and sovereign execution layer.

- **Frontend Repository:** [JiahaoAlbus/ynx-web4-website-new](https://github.com/JiahaoAlbus/ynx-web4-website-new)
- **Core Protocol Repository:** [JiahaoAlbus/YNX](https://github.com/JiahaoAlbus/YNX)

## Local Development

如何运行：

```bash
# 1. 安装依赖
npm install

# 2. 如何同步 docs：
npm run sync:docs

# 如何用本地 core repo 同步：
YNX_CORE_REPO_PATH=/path/to/YNX npm run sync:docs

# 3. 检查与构建
npm run lint
npm run build

# 4. 开发服务
npm run dev
```

## Deployment Notes

- This project is a standard React SPA built with Vite.
- Docs live in the `public/docs` folder but are initially pulled from the core protocol repository via the sync script. Ensure `npm run build` has access to network requests to fetch these documents.
- Ensure that you configure the production environment to serve `index.html` for any unresolved paths so that React Router can handle routing (SPA fallback).

