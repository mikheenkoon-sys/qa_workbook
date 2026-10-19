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
    quizzes/
      <quiz>.json    ← one quiz per file (used to seed the DB)

lib/content.ts       ← chapter registry (import & register meta.ts here)
lib/mdx.ts           ← reads .mdx files from disk with gray-matter
lib/quiz-schema.ts   ← Zod schema validating quiz JSON files
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

### 5. Quiz JSON Shape
- One file per quiz: `content/<slug>/quizzes/<quiz>.json`
- `prisma/seed.ts` reads every `*.json` in that folder (sorted by filename) and validates it with `QuizSchema` from `@/lib/quiz-schema` — invalid files fail the seed with a descriptive error
- Each question maps to `QuestionType.MULTIPLE_CHOICE` or `TRUE_FALSE`
- Rules enforced: exactly one correct option per question, `TRUE_FALSE` has exactly two options, `order` is unique within a quiz
- Questions are only inserted when a quiz has none in the DB; editing existing questions requires resetting them in the DB

```json
{
  "slug": "my-chapter-intro",
  "title": "Introduction Quiz",
  "description": "Short description.",
  "difficulty": "BEGINNER",
  "questions": [
    {
      "text": "Question text?",
      "type": "MULTIPLE_CHOICE",
      "order": 1,
      "options": [
        { "text": "Wrong", "isCorrect": false },
        { "text": "Right", "isCorrect": true }
      ]
    }
  ]
}
```

## Adding a New Chapter — Checklist

- [ ] Create `content/<slug>/` directory
- [ ] Create `content/<slug>/meta.ts` with valid `ChapterMeta`
- [ ] Create at least one `.mdx` article matching a slug in `meta.ts`
- [ ] Create `content/<slug>/quizzes/<quiz>.json` files with quiz questions
- [ ] Make sure the chapter exists in the `chapters` array in `prisma/seed.ts`
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
