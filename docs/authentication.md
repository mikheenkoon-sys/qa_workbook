# Authentication Guidelines

## Overview

All authentication in QA Workbook is handled exclusively by **Clerk** (`@clerk/nextjs` v7). No other authentication methods should be implemented or used.

## Core Rules

### 1. Clerk Only
- Use Clerk for all authentication flows
- Never implement custom auth logic
- Do not add alternative auth providers without explicit approval

### 2. All Routes Are Protected by Default
- `middleware.ts` protects every route that is not explicitly listed as public
- Public routes: `/sign-in(.*)`, `/sign-up(.*)`, `/api/webhooks/(.*)`
- Do NOT add new public routes without a deliberate reason

### 3. Middleware — Use `middleware.ts`
- The project uses standard `middleware.ts` (not `proxy.ts`)
- Never rename or move this file

## Implementation Patterns

### Middleware (do not change the matcher)
```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### Server-Side Auth Check (API Routes & Server Components)
```typescript
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // ...
}
```

### Client-Side Auth Check
```typescript
"use client";
import { useAuth, useUser } from "@clerk/nextjs";

export function ProtectedComponent() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  if (!isSignedIn) return null;
  return <div>Protected content</div>;
}
```

### Clerk Webhook Handler
```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  const headerPayload = await headers();
  const svixHeaders = {
    "svix-id":        headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const payload = await req.json();
  const event = wh.verify(JSON.stringify(payload), svixHeaders);
  // handle event...
}
```

### Linking Clerk Users to the Database
- The `User` model stores `clerkId` (the Clerk `userId`) as a unique foreign key
- Always resolve Prisma `User` by `clerkId`, never by internal `id` from the JWT
```typescript
const { userId: clerkId } = await auth();
const user = await prisma.user.findUnique({ where: { clerkId } });
```

## Environment Variables

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
```

## Checklist Before Writing Auth-Related Code
- [ ] Using `clerkMiddleware` with the existing `isPublicRoute` matcher
- [ ] Server components / API routes call `auth()` from `@clerk/nextjs/server`
- [ ] Client components use `useAuth` / `useUser` from `@clerk/nextjs`
- [ ] New API routes return `401` when `clerkId` is missing
- [ ] Webhook routes are listed as public in `isPublicRoute`
