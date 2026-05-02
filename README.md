# YNX Web4 Website

This is the official portal for the YNX Web4 public testnet and sovereign execution layer.

- **Frontend Repository:** [JiahaoAlbus/ynx-web4-website-new](https://github.com/JiahaoAlbus/ynx-web4-website-new)
- **Core Protocol Repository:** [JiahaoAlbus/YNX](https://github.com/JiahaoAlbus/YNX)

## Local Development

To run this project locally, execute the following commands:

```bash
# 1. Install dependencies
npm install

# 2. Sync docs from the YNX Core repository
npm run sync:docs

# Note: You can sync docs from a local copy of the YNX core protocol repository instead of github using an environment variable like so:
# YNX_CORE_REPO_PATH=/path/to/YNX npm run sync:docs

# 3. Run the development server
npm run dev
```

## Production Build

```bash
# This automatically runs the \`sync:docs\` before building.
npm run build
```

## Deployment Notes

- This project is a standard React SPA built with Vite.
- Docs live in the `public/docs` folder but are initially pulled from the core protocol repository via the sync script. Ensure \`npm run build\` has access to network requests to fetch these documents.
- Ensure that you configure the production environment to serve `index.html` for any unresolved paths so that React Router can handle routing (SPA fallback).

