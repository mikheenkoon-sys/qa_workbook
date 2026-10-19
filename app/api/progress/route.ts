import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) return NextResponse.json({ chapters: [] });

  const chapters = await prisma.chapter.findMany({
    where: { isPublished: true },
    include: {
      quizzes: {
        include: {
          attempts: {
            where: { userId: user.id },
            orderBy: { completedAt: "desc" },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  const progress = chapters.map((chapter) => {
    const allAttempts = chapter.quizzes.flatMap((q) => q.attempts);
    const attempted = new Set(allAttempts.map((a) => a.quizId)).size;
    const best = allAttempts.length
      ? Math.max(...allAttempts.map((a) => Math.round((a.score / a.totalQuestions) * 100)))
      : null;
    return {
      chapterId:        chapter.id,
      chapterSlug:      chapter.slug,
      totalQuizzes:     chapter.quizzes.length,
      completedQuizzes: attempted,
      bestScore:        best,
    };
  });

  return NextResponse.json({ progress });
}
