import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ChevronRight } from "lucide-react";
import type { Quiz } from "@prisma/client";

interface QuizCardProps {
  quiz: Quiz;
  href: string;
  lastScore?: { score: number; totalQuestions: number } | null;
}

import type { Difficulty } from "@prisma/client";

const difficultyColor: Record<Difficulty, "default" | "secondary" | "destructive"> = {
  BEGINNER:     "default",
  INTERMEDIATE: "secondary",
  ADVANCED:     "destructive",
};

export function QuizCard({ quiz, href, lastScore }: QuizCardProps) {
  const pct = lastScore ? Math.round((lastScore.score / lastScore.totalQuestions) * 100) : 0;

  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{quiz.title}</CardTitle>
                {lastScore && <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />}
              </div>
              <CardDescription className="mt-1 line-clamp-2">{quiz.description}</CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant={difficultyColor[quiz.difficulty]}>{quiz.difficulty}</Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        {lastScore && (
          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Last attempt</span>
              <span>{lastScore.score}/{lastScore.totalQuestions} ({pct}%)</span>
            </div>
            <Progress value={pct} className="h-1.5" />
          </CardContent>
        )}
      </Card>
    </Link>
  );
}
