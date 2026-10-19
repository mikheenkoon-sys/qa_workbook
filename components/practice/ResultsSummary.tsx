import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import { QuestionCard } from "./QuestionCard";
import type { AttemptWithDetails } from "@/types";

interface ResultsSummaryProps {
  attempt: AttemptWithDetails;
  chapterSlug: string;
}

export function ResultsSummary({ attempt, chapterSlug }: ResultsSummaryProps) {
  const pct = Math.round((attempt.score / attempt.totalQuestions) * 100);

  return (
    <div className="space-y-6">
      {/* Score card */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-4xl font-bold">{pct}%</div>
          <p className="text-muted-foreground">
            {attempt.score} / {attempt.totalQuestions} correct
          </p>
          <Badge variant={pct >= 80 ? "default" : pct >= 50 ? "secondary" : "destructive"}>
            {pct >= 80 ? "Excellent" : pct >= 50 ? "Good effort" : "Keep practicing"}
          </Badge>
        </CardContent>
      </Card>

      {/* Question breakdown */}
      <div className="space-y-4">
        {attempt.answers
          .sort((a, b) => a.question.order - b.question.order)
          .map((answer, i) => (
            <Card key={answer.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  {answer.isCorrect
                    ? <CheckCircle2 className="h-4 w-4 text-green-500" />
                    : <XCircle className="h-4 w-4 text-red-500" />}
                  <span className="text-xs text-muted-foreground">Question {i + 1}</span>
                </div>
              </CardHeader>
              <CardContent>
                <QuestionCard
                  question={answer.question}
                  selectedOptionId={answer.selectedOptionId}
                  revealed
                />
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/practice/${chapterSlug}`} />}
        >
          Back to Quizzes
        </Button>
        <Button
          nativeButton={false}
          render={<Link href={`/practice/${chapterSlug}/${attempt.quiz.slug}`} />}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
