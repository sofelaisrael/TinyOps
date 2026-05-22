# TinyOps

**Production-grade CI/CD prompts for Vercel & GitHub Actions.**

TinyOps is a curated library of battle-tested AI prompts that generate CI/CD workflows. Browse, copy, and ship — no fluff, no database costs.

## Features

- **55+ curated prompts** — deployment, testing, security, monorepo, notifications, and more
- **Tab system** — Prompt (context + requirements + output) and Sources (curated SO/GitHub/Dev.to links)
- **Better Prompt panel** — conditional toggles to customize prompts before copying
- **Copy as Claude Project Instructions** — one-click format-ready output
- **Favorites + recently viewed** — bookmark prompts for quick access
- **Quality scores** — each prompt rated by completeness and clarity
- **Full-text search** — search by title, description, category, and tags
- **Platform filter** — Vercel / GitHub Actions
- **Mobile-friendly** — responsive grid with slide-in filter drawer
- **RSS feed** — `/rss.xml`
- **Sitemap** — `/sitemap.xml`
- **404 with astronaut** — custom error page with the detailed astronaut SVG

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Animations | Framer Motion |
| Content | MDX via gray-matter |
| Email | Nodemailer (Gmail SMTP) |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel |

## Getting Started

```bash
git clone https://github.com/syntax-devv/TinyOps.git
cd TinyOps
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Copy `.env.local.example` to `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=your-email@gmail.com
FROM_NAME=TinyOps Dev
```

These are used by the suggestion and subscription endpoints. Gmail App Passwords require 2FA enabled on your Google account.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── prompts/route.ts          # GET all prompts (JSON)
│   │   ├── subscribe/route.ts        # POST subscribe (Nodemailer)
│   │   └── suggestions/route.ts      # POST suggestions (Nodemailer)
│   ├── prompt/[slug]/page.tsx        # Prompt detail page
│   ├── coming-soon/page.tsx          # Coming-soon for unfinished pages
│   ├── terms/page.tsx                # Redirects to coming-soon
│   ├── docs/page.tsx                 # Redirects to GitHub README
│   ├── page.tsx                      # Home / library listing
│   ├── not-found.tsx                 # Custom 404 with astronaut
│   ├── layout.tsx                    # Root layout + fonts
│   ├── globals.css                   # Global styles
│   ├── sitemap.ts                    # Dynamic sitemap
│   └── rss.xml/route.ts              # RSS feed
├── components/
│   ├── prompt-card.tsx               # Prompt card component
│   ├── prompt-tab-shell.tsx          # Tab manager (Prompt | Sources)
│   ├── tab-bar.tsx                   # Animated tab bar
│   ├── sources-tab.tsx               # Sources tab (curated links)
│   ├── better-prompt-panel.tsx       # Conditional toggles + copy
│   ├── mobile-filter-drawer.tsx      # Mobile slide-in filter drawer
│   ├── suggest-prompt-modal.tsx      # Suggestion modal
│   ├── logo.tsx                      # TinyOps wordmark + robot head
│   └── modals.tsx                    # Modals index
├── lib/
│   ├── mdx.ts                        # MDX parsing + Prompt type
│   ├── email.ts                      # Nodemailer transport
│   ├── favorites.ts                  # Favorites + recently viewed
│   └── utils.ts                      # cn() utility
└── types/
    └── nodemailer.d.ts               # Nodemailer type declarations
content/prompts/                       # 55 MDX prompt files
public/
├── favicon.svg                       # Robot head favicon
├── apple-touch-icon.svg              # Robot head icon
├── site.webmanifest                  # PWA manifest
└── illustrations/
    ├── astronaut.svg                 # Detailed astronaut (Saleh Riaz)
    └── starfield.svg                 # Star field background
```

## Content Management

Prompts live in `content/prompts/*.mdx`. Each file has YAML frontmatter:

```yaml
---
title: "Deploy Express.js Backend on Vercel"
slug: "vercel-express-deployment"
description: "Configure vercel.json and serverless entry points."
category: "Deployment"
tags: ["vercel", "express", "backend", "serverless"]
date: "2026-05-21"
files: ["api/index.js", "vercel.json"]
secrets: []
sources:
  - title: "How to deploy ExpressJS to Vercel"
    type: stackoverflow
    url: "https://stackoverflow.com/questions/..."
    votes: 20
  - title: "Vercel Deployment workflow"
    type: github
    url: "https://github.com/..."
    repo: "vercel/examples"
    stars: 5100
---
```

The body is a structured prompt with `**Context:**`, `**Goal:**`, `**Requirements:**`, and `**Output:**` sections.

### Adding a new prompt

1. Create a new `.mdx` file in `content/prompts/`
2. Add YAML frontmatter with title, slug, description, category, tags, date, and sources
3. Write the body following the existing structure
4. The prompt auto-appears in the library — no database migration needed

## Deployment

Optimized for Vercel. The `vercel.json` includes:

- `maxDuration: 30` for serverless functions
- Security headers (XSS, content-type, referrer-policy)
- CORS headers for API routes
- RSS rewrite

```bash
npm run build    # Verify build locally
vercel deploy    # Deploy to Vercel
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prompts` | GET | Returns all prompts as JSON |
| `/api/subscribe` | POST | Subscribe email (Nodemailer notification) |
| `/api/suggestions` | POST | Submit a prompt suggestion |

## Attribution

- Astronaut SVG by **Saleh Riaz** — [dribbble.com/salehriaz](https://dribbble.com/salehriaz)
- Robot icon by **Lucide** — [lucide.dev](https://lucide.dev)

## License

MIT
