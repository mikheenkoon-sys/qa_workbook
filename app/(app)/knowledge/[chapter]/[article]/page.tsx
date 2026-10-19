import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MDXContent } from "@/components/knowledge/MDXContent";
import { ChevronLeft } from "lucide-react";
import { getArticleContent } from "@/lib/mdx";
import prisma from "@/lib/prisma";
import { getChapterMeta } from "@/lib/content";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ chapter: string; article: string }>;
}) {
  const { chapter: chapterSlug, article: articleSlug } = await params;

  const [dbChapter, meta] = await Promise.all([
    prisma.chapter.findUnique({ where: { slug: chapterSlug } }),
    Promise.resolve(getChapterMeta(chapterSlug)),
  ]);

  if (!dbChapter) notFound();

  const articleMeta = meta?.articles.find((a) => a.slug === articleSlug);
  const mdx = getArticleContent(chapterSlug, articleSlug);

  if (!mdx) notFound();

  return (
    <div className="flex flex-col overflow-auto">
      <Header title={articleMeta?.title ?? articleSlug} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-8">
        <Link
          href={`/knowledge/${chapterSlug}`}
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> {dbChapter.title}
        </Link>

        <div className="mx-auto max-w-3xl">
          <MDXContent source={mdx.content} />
        </div>
      </main>
    </div>
  );
}
