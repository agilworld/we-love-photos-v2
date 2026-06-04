# We Love Photos

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-brightgreen.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-green.svg)
![pnpm](https://img.shields.io/badge/pnpm-9.15.0-red.svg)

> A photo search and AI background removal platform built with Next.js, Hono.js, Turso DB, and Transformers.js.

## About

We Love Photos helps you discover beautiful photos from multiple sources (Pexel, Unsplash Lite) and remove backgrounds using AI — all running in your browser. The web app serves as a frontend client, while a separate API server provides fast, domain-driven backend services.

## v2.0.0 — What's New

**Major architectural upgrade from monolith to monorepo:**

- 🚀 **Monorepo Architecture** — Converted to pnpm + Turborepo workspace for better code organization and shared packages
- 🔧 **Separate API Server** — New Hono.js API server running on its own port with Domain-Driven Design
- 🗄️ **Turso Database** — Integrated Unsplash Lite dataset via Turso (libsql/SQLite) with Drizzle ORM
- 📐 **DDD Structure** — Clean separation of concerns in the server: model → schema → repository → service → controller
- 📦 **Shared Packages** — Extracted common code into `@welovephotos/db`, `@welovephotos/validators`, `@welovephotos/utils`

---

## Architecture Overview

```
we-love-photos-app/
├── apps/
│   ├── web/                    # Next.js 15 frontend (static export)
│   └── server/                 # Hono.js API server (DDD)
├── packages/
│   ├── db/                     # Drizzle ORM schemas + Turso client
│   ├── validators/             # Zod validation schemas
│   └── utils/                  # Shared utility functions
├── data/                       # SQL/CSV data files (Unsplash Lite)
├── turbo.json                  # Turborepo configuration
├── pnpm-workspace.yaml         # pnpm workspace config
└── README.md
```

---

## Tech Stack

| Workspace | Technology |
|-----------|-----------|
| **Root** | pnpm 9.15.0, Turborepo 2.4.0 |
| **apps/web** | Next.js 15, React 19, TypeScript 5, Tailwind CSS, Shadcn/UI, Zustand, TanStack Query, Transformers.js (AI), Sentry |
| **apps/server** | Hono.js 4.6, TypeScript 5, Zod, @hono/node-server |
| **packages/db** | Drizzle ORM 0.36.4, @libsql/client 0.14.0 |
| **packages/validators** | Zod 3.24.1 |
| **packages/utils** | clsx, tailwind-merge |

---

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.15.0 (install: `npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd we-love-photos-app

# Install all workspace dependencies
pnpm install
```

### Environment Setup

#### apps/server/.env

```env
PORT=3010
TURSO_CONNECTION_URL=libsql://unsplash-lite-agilworld.aws-ap-northeast-1.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token-here
TURSO_ORG=agilworld
CORS_ORIGIN=http://localhost:3000
```

#### apps/web/.env

```env
NEXT_PUBLIC_UNSPLASH_BASE_API=https://api.unsplash.com/
NEXT_PUBLIC_UNSPLASH_CLIENT_KEY=your-unsplash-client-key
NEXT_PUBLIC_PEXEL_BASE_API=https://api.pexels.com/v1/
NEXT_PUBLIC_PEXEL_CLIENT_KEY=your-pexel-client-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:3010
VERCEL_OIDC_TOKEN=your-vercel-token
```

---

## Development

### Run everything (recommended)

```bash
# Starts both web (port 3000) and server (port 3010) via Turborepo
pnpm dev
```

### Run individually

```bash
# Web only
pnpm dev:web
# → http://localhost:3000

# Server only
pnpm dev:server
# → http://localhost:3010
```

### Build

```bash
# Build all workspaces
pnpm build
```

---

## API Reference

### Search Photos by Keyword

**Endpoint**: `GET /v1/api/search?keyword={string}`

**Query Parameters**:
- `keyword` (required, string, 1-200 chars) — Search keyword (e.g., "nature", "beach", "city")

**Example Request**:
```bash
curl "http://localhost:3010/v1/api/search?keyword=nature"
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "keyword": "nature",
    "total": 150,
    "photos": [
      {
        "photoId": "oSf8ePoG9NU",
        "photoUrl": "https://unsplash.com/photos/oSf8ePoG9NU",
        "photoImageUrl": "https://images.unsplash.com/...",
        "photoWidth": 4000,
        "photoHeight": 2667,
        "photoDescription": "...",
        "photographerUsername": "andrekoch",
        "photographerFirstName": "Andre",
        "photographerLastName": "Koch",
        "blurHash": "...",
        "aiDescription": "...",
        "statsViews": 4296224,
        "statsDownloads": 30072
      }
    ]
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": "keyword query parameter is required"
}
```

---

## Project Structure

### apps/web/ — Next.js Frontend

Static-exported React application for photo search and AI background removal.

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # UI components
│   ├── features/               # Feature modules (search, photoRemoval)
│   ├── libs/                   # Utility libraries
│   ├── providers/              # React context providers
│   └── sample-data/            # Sample data for development
├── public/                     # Static assets
├── .next/                      # Next.js build output
├── .eslintrc.json
├── next.config.ts              # Next.js config (output: "export")
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### apps/server/ — Hono.js API Server (DDD)

RESTful API server using Domain-Driven Design principles.

```
apps/server/
├── src/
│   ├── index.ts                # Server entry point
│   ├── photos/                 # "photos" domain module
│   │   ├── photo.controller.ts # HTTP route handler
│   │   ├── photo.service.ts    # Business logic
│   │   ├── photo.repository.ts # Data access (Drizzle)
│   │   ├── photo.schema.ts     # Zod validation
│   │   └── photo.model.ts      # TypeScript types
│   ├── middleware/             # Hono middleware
│   └── types/                  # Shared API types
├── .env                        # Environment variables
├── tsconfig.json
└── package.json
```

### packages/db/ — Database Layer

Drizzle ORM schemas and Turso client for the Unsplash Lite dataset.

```
packages/db/
├── src/
│   ├── schema.ts               # Drizzle table definitions (5 tables)
│   └── connection.ts           # Turso client + Drizzle instance
└── package.json
```

### packages/validators/ — Zod Schemas

Shared validation schemas using Zod.

```
packages/validators/
├── src/
│   ├── search.ts               # Search query validation
│   └── index.ts                # Barrel exports
└── package.json
```

### packages/utils/ — Shared Utilities

Common utility functions used across the monorepo.

```
packages/utils/
├── src/
│   └── index.ts                # cn(), chunks2Arr(), uniqueBy()
└── package.json
```

---

## Domain-Driven Design (Server)

The server follows clean DDD architecture with clear separation of layers:

| Layer | File | Responsibility |
|-------|------|----------------|
| **Model** | `photo.model.ts` | TypeScript interfaces/types for Photo domain |
| **Schema** | `photo.schema.ts` | Zod validation schemas for runtime validation |
| **Repository** | `photo.repository.ts` | Pure data access — Drizzle ORM queries, no business logic |
| **Service** | `photo.service.ts` | Business logic — orchestrates repo calls, transforms data |
| **Controller** | `photo.controller.ts` | HTTP layer — parses request, calls service, returns response |

### Flow Example (Search by Keyword)

1. **Controller** receives `GET /v1/api/search?keyword=nature`
2. **Schema** validates the keyword using Zod
3. **Service** calls repository to find photo IDs matching "nature"
4. **Repository** queries `unsplash_keywords` table → returns photo IDs
5. **Service** calls repository again to fetch full photo details
6. **Repository** queries `unsplash_photos` table by IDs
7. **Service** transforms and returns results
8. **Controller** sends JSON response

---

## Database Schema

The server connects to a Turso database hosting the Unsplash Lite dataset.

**Tables** (5 total):

| Table | Primary Key | Description |
|-------|-------------|-------------|
| `unsplash_photos` | `photo_id` | Photo metadata (dimensions, photographer, location, AI descriptions, blur hash) |
| `unsplash_keywords` | `(photo_id, keyword)` | Keyword-photo relationships with AI confidence scores |
| `unsplash_collections` | `(photo_id, collection_id)` | Collection-photo relationships |
| `unsplash_conversions` | — | Conversion tracking (downloads, clicks) |
| `unsplash_colors` | `(photo_id, hex)` | Color data per photo |

Full schema definition: [`data/create_table.sql`](data/create_table.sql)

---

## Environment Variables

| Variable | Workspace | Description | Default |
|----------|-----------|-------------|---------|
| `PORT` | server | API server port | 3010 |
| `TURSO_CONNECTION_URL` | server | Turso database URL | — |
| `TURSO_AUTH_TOKEN` | server | Turso authentication token | — |
| `TURSO_ORG` | server | Turso organization name | agilworld |
| `CORS_ORIGIN` | server | Allowed CORS origin | http://localhost:3000 |
| `NEXT_PUBLIC_UNSPLASH_BASE_API` | web | Unsplash API base URL | — |
| `NEXT_PUBLIC_UNSPLASH_CLIENT_KEY` | web | Unsplash API client key | — |
| `NEXT_PUBLIC_PEXEL_BASE_API` | web | Pexel API base URL | — |
| `NEXT_PUBLIC_PEXEL_CLIENT_KEY` | web | Pexel API client key | — |
| `NEXT_PUBLIC_API_BASE_URL` | web | Local API server URL | http://localhost:3010 |
| `VERCEL_OIDC_TOKEN` | web | Vercel OIDC token | — |

---

## Deployment

### Web App (Next.js)

The web app is configured for static export (`output: "export"`), suitable for deployment to:

- **Vercel** (recommended) — Automatic deployment from Git
- **Netlify** — Static site deployment
- **GitHub Pages** — Static hosting

Build command:
```bash
pnpm build
```

Output directory: `apps/web/out/`

### API Server (Hono.js)

Deploy the server to any Node.js hosting platform:

- **Vercel** — Use a serverless function or deploy as a separate project
- **Railway** — Simple Node.js deployment
- **Render** — Free tier available
- **DigitalOcean App Platform** — Container or Node.js

Build command:
```bash
cd apps/server
pnpm build
pnpm start
```

---

## License

[MIT](LICENSE) © Dian Afrial Rahadi Ragil

---

## Acknowledgments

- Photo data from [Pexel](https://www.pexels.com/) and [Unsplash](https://unsplash.com/)
- Background removal powered by [@huggingface/transformers.js](https://huggingface.co/docs/transformers.js)
- Icons by [Lucide](https://lucide.dev/)
- UI components from [Shadcn/UI](https://ui.shadcn.com/)

---

**Built with ❤️ for photo lovers everywhere**