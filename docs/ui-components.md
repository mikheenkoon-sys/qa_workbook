# UI Components Guidelines

## Overview

QA Workbook uses **shadcn/ui** as the primary component library. Components live in `@/components/ui/`. Do not create custom replacements for components that already exist in shadcn/ui.

## Core Rules

### 1. shadcn/ui First
- Always check `components/ui/` before building a new UI primitive
- Install missing components via CLI: `npx shadcn@latest add <component-name>`
- Extend existing components with composition rather than reimplementing them

### 2. No Inline Styles
- Use Tailwind CSS utility classes exclusively
- Use the `cn()` helper from `@/lib/utils` to merge conditional class names

### 3. Server vs Client Components
- Default to **Server Components**
- Add `"use client"` only when the component requires interactivity, hooks, or browser APIs
- Interactive wrappers (e.g. `QuizEngine`, `ResetProgressButton`) live in `components/practice/`

### 4. Base UI
- `@base-ui/react` is available for headless primitives not covered by shadcn/ui
- Prefer shadcn/ui; reach for Base UI only when shadcn/ui has no suitable component

## Currently Installed shadcn/ui Components

| Component | Import path |
|-----------|-------------|
| `alert-dialog` | `@/components/ui/alert-dialog` |
| `avatar` | `@/components/ui/avatar` |
| `badge` | `@/components/ui/badge` |
| `button` | `@/components/ui/button` |
| `card` | `@/components/ui/card` |
| `dialog` | `@/components/ui/dialog` |
| `dropdown-menu` | `@/components/ui/dropdown-menu` |
| `progress` | `@/components/ui/progress` |
| `radio-group` | `@/components/ui/radio-group` |
| `scroll-area` | `@/components/ui/scroll-area` |
| `select` | `@/components/ui/select` |
| `separator` | `@/components/ui/separator` |
| `skeleton` | `@/components/ui/skeleton` |
| `tabs` | `@/components/ui/tabs` |

## Implementation Patterns

### cn() helper for conditional classes
```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-class", isActive && "active-class", className)} />
```

### Button variants
```typescript
import { Button } from "@/components/ui/button";

<Button variant="default">Primary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Card layout
```typescript
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Loading skeletons
```typescript
import { Skeleton } from "@/components/ui/skeleton";

<Skeleton className="h-4 w-[200px]" />
```

### Confirmation dialog
```typescript
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Reset</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Difficulty badge
```typescript
import { Badge } from "@/components/ui/badge";
import type { Difficulty } from "@prisma/client";

const variantMap: Record<Difficulty, "default" | "secondary" | "destructive"> = {
  BEGINNER:     "default",
  INTERMEDIATE: "secondary",
  ADVANCED:     "destructive",
};

<Badge variant={variantMap[difficulty]}>{difficulty}</Badge>
```

## Theming (Light / Dark)

- `next-themes` is configured in `components/providers/ThemeProvider.tsx` (class strategy, **default theme: `dark`**, system option enabled)
- Theme tokens live in `app/globals.css` (`:root` for light, `.dark` for dark) — use semantic tokens (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, …) instead of hard-coded colors
- The switcher is `components/layout/ThemeToggle.tsx` (rendered in `Header`)

## Component Directory Conventions

| Folder | Purpose |
|--------|---------|
| `components/ui/` | Raw shadcn/ui primitives — never add business logic here |
| `components/layout/` | `Header`, `Sidebar` — page-frame components |
| `components/knowledge/` | Article/chapter display components |
| `components/practice/` | Quiz engine, question cards, result components |
| `components/providers/` | Context providers (`QueryProvider`) |

## Lucide Icons
- Use `lucide-react` for all icons
- Import only what you need — no wildcard imports
```typescript
import { BookOpen, ChevronRight, Trophy } from "lucide-react";
```
