import { z } from "zod";

const OptionSchema = z.object({
  text: z.string().min(1),
  isCorrect: z.boolean(),
});

const QuestionSchema = z
  .object({
    text: z.string().min(1),
    type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]),
    order: z.number().int().positive(),
    options: z.array(OptionSchema).min(2),
  })
  .refine((q) => q.options.filter((o) => o.isCorrect).length === 1, {
    message: "A question must have exactly one correct option",
    path: ["options"],
  })
  .refine((q) => q.type !== "TRUE_FALSE" || q.options.length === 2, {
    message: "A TRUE_FALSE question must have exactly two options",
    path: ["options"],
  });

export const QuizSchema = z
  .object({
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
    questions: z.array(QuestionSchema).min(1),
  })
  .refine((quiz) => new Set(quiz.questions.map((q) => q.order)).size === quiz.questions.length, {
    message: "Question order values must be unique within a quiz",
    path: ["questions"],
  });

export type QuizData = z.infer<typeof QuizSchema>;
