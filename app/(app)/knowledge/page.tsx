import { Header } from "@/components/layout/Header";
import { ChapterCard } from "@/components/knowledge/ChapterCard";
import prisma from "@/lib/prisma";

export default async function KnowledgePage() {
  const chapters = await prisma.chapter.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex flex-col overflow-auto">
      <Header title="Knowledge Base" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <p className="mb-6 text-muted-foreground">
          Select a chapter to read articles and deepen your QA knowledge.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              href={`/knowledge/${chapter.slug}`}
              badgeLabel={chapter.slug === "github-copilot" ? "New" : undefined}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
