import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Chapter } from "@prisma/client";

interface ChapterCardProps {
  chapter: Chapter;
  quizCount?: number;
  href: string;
  badgeLabel?: string;
}

export function ChapterCard({ chapter, quizCount, href, badgeLabel }: ChapterCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <span className="text-3xl" role="img" aria-label={chapter.title}>
              {chapter.icon}
            </span>
            {badgeLabel && <Badge variant="secondary">{badgeLabel}</Badge>}
          </div>
          <CardTitle className="mt-2 text-base">{chapter.title}</CardTitle>
          <CardDescription className="line-clamp-2">{chapter.description}</CardDescription>
        </CardHeader>
        {quizCount !== undefined && (
          <CardContent>
            <p className="text-xs text-muted-foreground">{quizCount} quiz{quizCount !== 1 ? "zes" : ""}</p>
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
