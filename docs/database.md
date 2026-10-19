# Database Guidelines

## Overview

QA Workbook uses **Prisma ORM** (`prisma` + `@prisma/client` v5.22) with a **PostgreSQL** database hosted on **Neon**. All data access goes through the shared Prisma client at `@/lib/prisma`.

## Core Rules

### 1. Single Prisma Client Instance
- Always import the client from `@/lib/prisma`
- Never instantiate `new PrismaClient()` outside of `lib/prisma.ts`

### 2. Schema Source of Truth
- `prisma/schema.prisma` is the single source of truth for the data model
- Run `npx prisma generate` after any schema change to regenerate the client
- Run `npx prisma migrate dev --name <name>` to create a migration

### 3. Use Prisma Types
- Import model types from `@prisma/client`, not from manual type definitions
- Compose extended types in `types/index.ts` using Prisma-generated types as a base

## Schema Overview

```
User          — linked to Clerk via clerkId
Chapter       — top-level content group; has many Quizzes
Quiz          — belongs to a Chapter; has many Questions; difficulty: BEGINNER | INTERMEDIATE | ADVANCED
Question      — belongs to a Quiz; type: MULTIPLE_CHOICE | TRUE_FALSE
Option        — belongs to a Question; isCorrect flag
QuizAttempt   — belongs to User + Quiz; stores score and completedAt
AttemptAnswer — belongs to QuizAttempt + Question + Option; records isCorrect
```

## Environment Variables

```
DATABASE_URL=   # pooled connection (used by Prisma Client)
DIRECT_URL=     # direct connection (used for migrations)
```

## Common Query Patterns

### Find a User by Clerk ID
```typescript
import prisma from "@/lib/prisma";

const user = await prisma.user.findUnique({ where: { clerkId } });
```

### Chapter list with quiz counts
```typescript
const chapters = await prisma.chapter.findMany({
  where: { isPublished: true },
  orderBy: { order: "asc" },
  include: {
    quizzes: {
      select: { id: true, _count: { select: { attempts: true } } },
    },
  },
});
```

### Record a quiz attempt
```typescript
const attempt = await prisma.quizAttempt.create({
  data: {
    userId:   user.id,
    quizId,
    score,
    answers: {
      create: answerData, // { questionId, selectedOptionId, isCorrect }[]
    },
  },
});
```

### User progress for a chapter
```typescript
const attempts = await prisma.quizAttempt.findMany({
  where: { userId: user.id, quiz: { chapterId } },
  select: { quizId: true, score: true },
  orderBy: { completedAt: "desc" },
});
```

## Seeding

- Seed file: `prisma/seed.ts`
- Run: `npx prisma db seed`
- Defined in `package.json` under `"prisma": { "seed": "tsx prisma/seed.ts" }`

## Migration Workflow

```bash
# 1. Edit prisma/schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name <descriptive-name>
# 3. Regenerate client (done automatically by migrate dev)
npx prisma generate
# 4. Update types/index.ts if new types are needed
```

## Checklist Before Writing Database Code
- [ ] Importing `prisma` from `@/lib/prisma`
- [ ] Authenticating the request and resolving `clerkId` before any DB query
- [ ] Using `findUnique` / `findFirst` with proper `where` constraints
- [ ] Not exposing internal database IDs in public API responses unless necessary
- [ ] Running `prisma generate` after schema changes
