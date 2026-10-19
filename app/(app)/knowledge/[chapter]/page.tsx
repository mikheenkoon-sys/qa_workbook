import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArticleCard } from "@/components/knowledge/ArticleCard";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { getChapterMeta } from "@/lib/content";

export default async function ChapterPage({ params }: { params: Promise<{ chapter: string }> }) {
  const { chapter: slug } = await params;

  const [dbChapter, meta] = await Promise.all([
    prisma.chapter.findUnique({ where: { slug } }),
    Promise.resolve(getChapterMeta(slug)),
  ]);

  if (!dbChapter) notFound();

  return (
    <div className="flex flex-col overflow-auto">
      <Header title={dbChapter.title} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <Link
          href="/knowledge"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Knowledge Base
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <span className="text-4xl">{dbChapter.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{dbChapter.title}</h2>
            <p className="text-sm text-muted-foreground">{dbChapter.description}</p>
          </div>
        </div>

        {meta?.articles.length ? (
          <div className="space-y-3">
            {meta.articles.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                href={`/knowledge/${slug}/${article.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Badge variant="secondary">Coming Soon</Badge>
            <p className="text-muted-foreground">Articles for this chapter are being prepared.</p>
          </div>
        )}
      </main>
    </div>
  );
}
