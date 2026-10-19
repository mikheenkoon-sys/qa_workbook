import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ResultsSummary } from "@/components/practice/ResultsSummary";
import prisma from "@/lib/prisma";

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ chapter: string; quizId: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}) {
  const { chapter: chapterSlug } = await params;
  const { attemptId } = await searchParams;

  if (!attemptId) notFound();

  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: true,
      answers: {
        include: {
          question: { include: { options: true } },
          selectedOption: true,
        },
        orderBy: { question: { order: "asc" } },
      },
    },
  });

  if (!attempt) notFound();

  return (
    <div className="flex flex-col overflow-auto">
      <Header title="Quiz Results" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <ResultsSummary attempt={attempt} chapterSlug={chapterSlug} />
        </div>
      </main>
    </div>
  );
}
