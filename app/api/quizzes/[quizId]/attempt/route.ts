import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

const bodySchema = z.object({
  answers: z.array(
    z.object({
      questionId:       z.string().min(1),
      selectedOptionId: z.string().min(1),
    })
  ),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> }
) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { quizId } = await params;

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const [user, quiz] = await Promise.all([
    getOrCreateUser(clerkId),
    prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: { include: { options: true } } },
    }),
  ]);

  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Calculate score
  const optionMap = new Map(
    quiz.questions.flatMap((q) => q.options.map((o) => [o.id, o]))
  );

  let score = 0;
  const answerData = parsed.data.answers.map(({ questionId, selectedOptionId }) => {
    const option = optionMap.get(selectedOptionId);
    const isCorrect = option?.isCorrect ?? false;
    if (isCorrect) score++;
    return { questionId, selectedOptionId, isCorrect };
  });

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId:         user.id,
      quizId:         quiz.id,
      score,
      totalQuestions: quiz.questions.length,
      answers: {
        create: answerData,
      },
    },
  });

  return NextResponse.json({ attemptId: attempt.id, score, totalQuestions: quiz.questions.length });
}
