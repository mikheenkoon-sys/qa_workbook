import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ chapter: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chapter: chapterSlug } = await params;

  const [user, chapter] = await Promise.all([
    prisma.user.findUnique({ where: { clerkId } }),
    prisma.chapter.findUnique({ where: { slug: chapterSlug }, include: { quizzes: true } }),
  ]);

  if (!user || !chapter) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const quizIds = chapter.quizzes.map((q) => q.id);

  // AttemptAnswers are cascade-deleted when QuizAttempt is deleted
  await prisma.quizAttempt.deleteMany({
    where: { userId: user.id, quizId: { in: quizIds } },
  });

  return NextResponse.json({ deleted: true });
}
