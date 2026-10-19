<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Agent Instructions for QA Workbook

This document provides guidance for AI coding assistants working on the QA Workbook project. Follow these guidelines to maintain consistency, quality, and project standards.

## Project Overview

QA Workbook is a learning and practice platform for QA engineers. It provides an MDX-powered knowledge base and a database-backed quiz/practice system with progress tracking.

## Quick Reference

- **Framework**: Next.js 16.3.4 (App Router)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL (Neon) with Prisma ORM v5
- **Authentication**: Clerk v7 (`@clerk/nextjs`)
- **UI Components**: shadcn/ui + Radix UI (+ `@base-ui/react` for headless primitives)
- **State / Data Fetching**: TanStack Query v5
- **Content**: MDX via `next-mdx-remote`, `gray-matter`, `remark-gfm`
- **Validation**: Zod v4
- **Package Manager**: npm

## Detailed Documentation

> **CRITICAL — NON-NEGOTIABLE**: You MUST read every relevant file in the `/docs` directory BEFORE writing or generating ANY code. This is not optional. Generating code without first reading the applicable docs is strictly forbidden and will result in incorrect, inconsistent output.

- **[Authentication](./docs/authentication.md)** — Clerk integration, protected routes, middleware, webhook handler, DB user linking
- **[UI Components](./docs/ui-components.md)** — shadcn/ui usage, available components, Tailwind conventions, icon library
- **[Database](./docs/database.md)** — Prisma client usage, schema overview, common query patterns, migration workflow
- **[Content System](./docs/content-system.md)** — MDX knowledge base, chapter registry, adding new chapters and articles

**Before writing any code**, identify which of the above files apply to your task and read them in full using your file-reading tools. Do not skip this step under any circumstances.

## Core Principles

### 1. Middleware — `middleware.ts` Only
- The project uses standard `middleware.ts` (not `proxy.ts`)
- All route protection is handled there via Clerk's `clerkMiddleware`

### 2. Type Safety First
- Always use TypeScript with strict mode enabled
- Avoid `any` types — use proper typing or `unknown` when necessary
- Define explicit return types for API route handlers
- Compose extended Prisma types in `types/index.ts`

### 3. Component Standards
- Use Server Components by default
- Add `"use client"` only when necessary (interactivity, hooks, browser APIs)
- Follow React 19 conventions

### 4. Security Best Practices
- Validate all API request bodies with Zod before touching the database
- Always verify `clerkId` from `auth()` before any authenticated DB query
- Use environment variables for all secrets
- Follow OWASP guidelines

### 5. Content vs Database
- Knowledge articles → MDX files in `content/`
- Quiz questions → Prisma database (seeded from `content/<chapter>/quizzes/*.json`)
- Do not mix concerns between these two systems

## Path Aliases

Use the `@/` alias for all internal imports:
```typescript
import { Button }  from "@/components/ui/button";
import prisma      from "@/lib/prisma";
import { cn }      from "@/lib/utils";
import type { ... } from "@/types";
```

## Environment Variables

Required variables (set in `.env.local`):
```
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
```

## Development Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # eslint
npx prisma studio    # open Prisma Studio (DB browser)
npx prisma migrate dev --name <name>   # create + apply migration
npx prisma db seed   # seed database
```
