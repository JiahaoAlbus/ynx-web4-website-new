# YNX Web4 Website

The official portal for YNX Web4 — an AI-native sovereign execution layer for humans and AI agents.

## Overview
This repository contains the frontend source for the YNX Web4 website. The site serves as the primary interface for developers, validators, and researchers to interact with the YNX public testnet.

## Core Positioning
- **AI-Native Sovereign Execution Layer**: Not just a chain, but an execution environment designed for machine-native coordination.
- **Web4 Primitives**: Owner > Policy > Session Key > Agent Action.
- **Public Testnet**: Currently in V2-Web4 track, optimized for security-hardening and external validator onboarding.

## Project Structure
- `src/pages`: Main application views (Home, Builders, Validators, Research, Testnet, About, Docs).
- `src/contexts`: Multi-language support and global state.
- `src/constants`: Network endpoints and project-level constants.
- `src/data`: Documentation registry and static content.

## Tech Stack
- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- Lucide React (Icons)

## Development
```bash
npm install
npm run dev
```

## Deployment
Builds into a standard SPA in `dist/`. Suitable for static hosting or as part of a full-stack Express service.

## Security Notice
The YNX Web4 public testnet is under active development. Test tokens (anyxt) have no mainnet value. Do not share private keys or production credentials within testnet environments.
