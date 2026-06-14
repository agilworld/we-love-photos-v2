# Vercel Deployment Fix for `apps/server`

## Problem
Vercel deployment fails with "bun install" error because:
1. `bunfig.toml` tells Vercel to use Bun (not supported)
2. Workspace dependencies (`@welovephotos/db`, etc.) need pnpm, not npm/bun
3. Deploying with `--cwd apps/server` isolates the project from the monorepo

## Solution
Deploy the monorepo root, then configure Vercel to treat `apps/server` as the root directory.

### Steps

1. **Clean up local files** (already done):
   ```bash
   # Renamed bunfig.toml → bunfig.toml.local
   # Removed .npmrc and lockfile symlinks
   # Updated vercel.json
   ```

2. **Link project from repo root** (in Vercel dashboard):
   - Go to https://vercel.com/new
   - Import GitHub repository: `agilworld/we-love-photos-v2`
   - Project name: `we-love-photos-api`
   - Framework Preset: **Other**
   - Root Directory: **apps/server**
   - Install Command: **pnpm install --frozen-lockfile**
   - Build Command: (leave blank)
   - Click Deploy

3. **Configure environment variables** in the Vercel project dashboard:
   - `TURSO_CONNECTION_URL` → `libsql://unsplash-lite-agilworld.aws-ap-northeast-1.turso.io`
   - `TURSO_AUTH_TOKEN` → *(your Turso token)*
   - `TURSO_ORG` → `agilworld`
   - `CORS_ORIGIN` → `https://we-love-photos-app.vercel.app`

4. **Connect to GitHub** (for auto-deploy):
   - Project Settings → Git → Connect Repository
   - Select `agilworld/we-love-photos-v2` branch `master`

5. **Test the deployment**:
   ```bash
   curl https://we-love-photos-api.vercel.app/api/v1/api/search?keyword=cat&limit=5
   ```

## What Changed

### Modified Files
- ✅ `apps/server/bunfig.toml` → `bunfig.toml.local` (avoid Vercel detection)
- ✅ `apps/server/src/index.ts` - removed Bun boot, added `export { app }`
- ✅ `apps/server/src/serve.ts` - NEW file for Bun dev
- ✅ `apps/server/api/[[...route]].ts` - NEW Vercel function entry
- ✅ `apps/server/package.json` - updated dev/build scripts
- ✅ `apps/web/vercel.json` - removed legacy config
- ✅ `.gitignore` - added `apps/*/.vercel/` and `packages/*/.vercel/`
- ✅ `apps/server/src/index.ts` - removed `.basePath("/api")` for routing consistency
- ✅ `apps/server/vercel.json` - function memory config

### Unchanged Files
- `packages/db` - still exports raw TypeScript (Vercel bundles it)
- `packages/utils` - unchanged
- `packages/validators` - unchanged
- Web app deployment - unchanged (already Vercel-linked)

## After Deployment

1. **Set web app environment variable**:
   - Go to `we-love-photos-app` Vercel project
   - Add `NEXT_PUBLIC_API_BASE_URL = https://we-love-photos-api.vercel.app/api`

2. **Verify CORS**:
   - Set `CORS_ORIGIN` in server project to match web app domain
   - The web app will call `/api/v1/api/search` → server routes `/v1/api/search`

3. **Local dev still works**:
   ```bash
   bun --hot apps/server/src/serve.ts  # Runs on :3010
   # Web app: NEXT_PUBLIC_API_BASE_URL=http://localhost:3010
   ```

## Why This Approach?

1. **Monorepo support**: Vercel detects `pnpm-workspace.yaml` at repo root
2. **Workspace deps**: `pnpm install` from root resolves `workspace:*` correctly
3. **Root Directory**: `apps/server` tells Vercel where the app lives
4. **Include files**: Vercel automatically includes workspace packages
5. **Vercel functions**: `api/[[...route]].ts` provides Node.js serverless entry
6. **No Bun runtime**: Use `@hono/node-server` adapter instead

## Alternative: Deploy to Bun-Friendly Platform

If Vercel setup is too complex, the server can be deployed to:
- **Fly.io** (`fly launch --remote-only`)
- **Railway** (`railway up`)
- **Render** (Dockerfile with `oven/bun:latest`)
- **Cloudflare Workers** (Hono with edge runtime)

But Vercel keeps everything in one platform with the web app.