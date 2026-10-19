import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { QuizEngine } from "@/components/practice/QuizEngine";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";

import type { Difficulty } from "@prisma/client";

const difficultyColor: Record<Difficulty, "default" | "secondary" | "destructive"> = {
  BEGINNER:     "default",
  INTERMEDIATE: "secondary",
  ADVANCED:     "destructive",
};

export default async function QuizPage({
  params,
}: {
  params: Promise<{ chapter: string; quizId: string }>;
}) {
  const { chapter: chapterSlug, quizId: quizSlug } = await params;

  const quiz = await prisma.quiz.findUnique({
    where: { slug: quizSlug },
    include: {
      questions: { include: { options: true }, orderBy: { order: "asc" } },
      chapter: true,
    },
  });

  if (!quiz || quiz.chapter.slug !== chapterSlug) notFound();
  if (quiz.questions.length === 0) notFound();

  return (
    <div className="flex flex-col overflow-auto">
      <Header title={quiz.title} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <Link
          href={`/practice/${chapterSlug}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> {quiz.chapter.title}
        </Link>

        <div className="mb-6 flex items-center gap-2">
          <h2 className="text-xl font-bold">{quiz.title}</h2>
          <Badge variant={difficultyColor[quiz.difficulty]}>{quiz.difficulty}</Badge>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">{quiz.description}</p>

        <div className="mx-auto max-w-2xl">
          <QuizEngine quiz={quiz} chapterSlug={chapterSlug} />
        </div>
      </main>
    </div>
  );
}
