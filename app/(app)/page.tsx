import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const { userId: clerkId } = await auth();

  const user = clerkId
    ? await prisma.user.findUnique({
        where: { clerkId },
        include: {
          attempts: {
            include: { quiz: { include: { chapter: true } } },
            orderBy: { completedAt: "desc" },
            take: 5,
          },
        },
      })
    : null;

  const chapters = await prisma.chapter.findMany({
    where: { isPublished: true },
    include: { quizzes: true },
    orderBy: { order: "asc" },
  });

  // Build per-chapter progress
  const progressMap = new Map<string, { completed: number; total: number; best: number }>();
  for (const chapter of chapters) {
    const total = chapter.quizzes.length;
    if (total === 0) {
      progressMap.set(chapter.slug, { completed: 0, total: 0, best: 0 });
      continue;
    }
    const attempts = user?.attempts.filter((a) => a.quiz.chapterId === chapter.id) ?? [];
    const attempted = new Set(attempts.map((a) => a.quizId)).size;
    const best = attempts.length
      ? Math.max(...attempts.map((a) => Math.round((a.score / a.totalQuestions) * 100)))
      : 0;
    progressMap.set(chapter.slug, { completed: attempted, total, best });
  }

  const recentAttempts = user?.attempts ?? [];

  return (
    <div className="flex flex-col overflow-auto">
      <Header title="Dashboard" />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 sm:px-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold">Welcome back 👋</h2>
          <p className="text-muted-foreground">Track your QA learning progress below.</p>
        </div>

        {/* Quick stats */}
        <div className="grid max-w-xl grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chapters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{chapters.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quizzes Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{recentAttempts.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Chapter progress */}
        <div>
          <h3 className="mb-4 font-heading text-lg font-semibold">Chapter Progress</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.map((chapter) => {
              const prog = progressMap.get(chapter.slug)!;
              const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
              return (
                <Card key={chapter.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{chapter.icon}</span>
                        <CardTitle className="text-sm">{chapter.title}</CardTitle>
                      </div>
                      {prog.total === 0 && (
                        <Badge variant="secondary" className="text-xs">Coming soon</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    <Progress value={pct} className="h-1.5" />
                    <p className="text-xs text-muted-foreground">
                      {prog.completed}/{prog.total} quizzes
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent attempts */}
        {recentAttempts.length > 0 && (
          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold">Recent Attempts</h3>
            <div className="space-y-2">
              {recentAttempts.map((attempt) => (
                <Card key={attempt.id}>
                  <CardContent className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{attempt.quiz.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {attempt.quiz.chapter.title} · {attempt.completedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      (attempt.score / attempt.totalQuestions) >= 0.8 ? "default" :
                      (attempt.score / attempt.totalQuestions) >= 0.5 ? "secondary" : "destructive"
                    }>
                      {attempt.score}/{attempt.totalQuestions}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-3">
          <Link href="/knowledge" className="flex items-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            <BookOpen className="h-4 w-4" /> Browse Knowledge Base
          </Link>
          <Link href="/practice" className="flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
            <Target className="h-4 w-4" /> Start Practicing
          </Link>
        </div>
      </main>
    </div>
  );
}
