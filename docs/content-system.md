# Content System Guidelines

## Overview

QA Workbook has two content systems:

1. **Knowledge base** — MDX articles rendered at `/knowledge/[chapter]/[article]`
2. **Practice quizzes** — questions stored in the PostgreSQL database (see [database.md](./database.md))

This document covers the MDX knowledge-base system.

## Architecture

```
content/
  <chapter-slug>/
    meta.ts          ← chapter + article metadata (title, description, order)
    <article>.mdx    ← article body (MDX format)
    questions.ts     ← quiz questions for the chapter (used to seed the DB)

lib/content.ts       ← chapter registry (import & register meta.ts here)
lib/mdx.ts           ← reads .mdx files from disk with gray-matter
```

## Core Rules

### 1. Register Every New Chapter
- After creating `content/<slug>/meta.ts`, add it to the registry in `lib/content.ts`
```typescript
// lib/content.ts
import myChapterMeta from "@/content/my-chapter/meta";

const registry: Record<string, ChapterMeta> = {
  "github-copilot": githubCopilotMeta,
  "my-chapter":     myChapterMeta, // ← add here
};
```

### 2. meta.ts Shape
- Must satisfy the `ChapterMeta` type from `@/types`
- `articles` array order determines display order
```typescript
import type { ChapterMeta } from "@/types";

const meta: ChapterMeta = {
  slug:        "my-chapter",
  title:       "My Chapter",
  description: "Short description shown on the chapter card.",
  icon:        "📚",              // single emoji
  order:       2,                  // determines sidebar/listing order
  articles: [
    { slug: "intro",   title: "Introduction",    description: "..." },
    { slug: "details", title: "Deep Dive",        description: "..." },
  ],
};

export default meta;
```

### 3. MDX Article Format
- File name must match the `slug` in `meta.ts` exactly: `<slug>.mdx`
- Frontmatter is optional; the canonical title comes from `meta.ts`
- Use standard GitHub Flavored Markdown; `remark-gfm` is enabled

```mdx
## Section Heading

Regular markdown content, code blocks, tables, etc.

\`\`\`typescript
const example = "code";
\`\`\`
```

### 4. MDX Rendering
- Articles are rendered with `next-mdx-remote` via `MDXContent` component (`components/knowledge/MDXContent.tsx`)
- Custom MDX components can be registered in `MDXContent`'s `components` prop
- Prose styles come from `@tailwindcss/typography` (`prose` class)

### 5. questions.ts Shape
- Used to seed quizzes for the chapter into the database
- Each question maps to `QuestionType.MULTIPLE_CHOICE` or `TRUE_FALSE`

## Adding a New Chapter — Checklist

- [ ] Create `content/<slug>/` directory
- [ ] Create `content/<slug>/meta.ts` with valid `ChapterMeta`
- [ ] Create at least one `.mdx` article matching a slug in `meta.ts`
- [ ] Create `content/<slug>/questions.ts` with quiz questions
- [ ] Register the meta in `lib/content.ts`
- [ ] Seed the database: `npx prisma db seed`

## File Reading API

```typescript
import { getArticleContent } from "@/lib/mdx";
import { getChapterMeta }    from "@/lib/content";

// Returns { content: string, frontmatter: Record<string, unknown> } | null
const article = getArticleContent("github-copilot", "introduction");

// Returns ChapterMeta | null
const meta = getChapterMeta("github-copilot");
```
