import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { Header } from "@/components/layout/Header";
import { QuizCard } from "@/components/practice/QuizCard";
import { ResetProgressButton } from "@/components/practice/ResetProgressButton";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ChapterPracticePage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter: slug } = await params;
  const { userId: clerkId } = await auth();

  const chapter = await prisma.chapter.findUnique({
    where: { slug },
    include: {
      quizzes: {
        include: { _count: { select: { questions: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!chapter) notFound();

  // Fetch last attempt per quiz for the current user
  const user = clerkId ? await prisma.user.findUnique({ where: { clerkId } }) : null;

  const lastAttempts = user
    ? await prisma.quizAttempt.findMany({
        where: {
          userId: user.id,
          quiz: { chapterId: chapter.id },
        },
        orderBy: { completedAt: "desc" },
      })
    : [];

  const lastAttemptByQuiz = new Map(
    lastAttempts.map((a) => [a.quizId, { score: a.score, totalQuestions: a.totalQuestions }])
  );

  // Keep only the most recent attempt per quiz
  const seenQuizIds = new Set<string>();
  const deduped = lastAttempts.filter((a) => {
    if (seenQuizIds.has(a.quizId)) return false;
    seenQuizIds.add(a.quizId);
    return true;
  });
  const dedupeMap = new Map(
    deduped.map((a) => [a.quizId, { score: a.score, totalQuestions: a.totalQuestions }])
  );

  const hasProgress = dedupeMap.size > 0;

  return (
    <div className="flex flex-col overflow-auto">
      <Header title={chapter.title} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <Link
          href="/practice"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Practice
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{chapter.icon}</span>
            <div>
              <h2 className="text-xl font-bold">{chapter.title}</h2>
              <p className="text-sm text-muted-foreground">{chapter.description}</p>
            </div>
          </div>
          {hasProgress && <ResetProgressButton chapterSlug={slug} />}
        </div>

        {chapter.quizzes.length > 0 ? (
          <div className="space-y-3">
            {chapter.quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                href={`/practice/${slug}/${quiz.slug}`}
                lastScore={dedupeMap.get(quiz.id) ?? null}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Badge variant="secondary">Coming Soon</Badge>
            <p className="text-muted-foreground">Quizzes for this chapter are being prepared.</p>
          </div>
        )}
      </main>
    </div>
  );
}
