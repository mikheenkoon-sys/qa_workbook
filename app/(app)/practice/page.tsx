import { Header } from "@/components/layout/Header";
import { ChapterCard } from "@/components/knowledge/ChapterCard";
import prisma from "@/lib/prisma";

export default async function PracticePage() {
  const chapters = await prisma.chapter.findMany({
    where: { isPublished: true },
    include: { _count: { select: { quizzes: true } } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex flex-col overflow-auto">
      <Header title="Practice" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <p className="mb-6 text-muted-foreground">
          Select a chapter to practice with quizzes and sharpen your knowledge.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              quizCount={chapter._count.quizzes}
              href={`/practice/${chapter.slug}`}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
