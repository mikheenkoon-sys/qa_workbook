import type { Chapter, Quiz, Question, Option, QuizAttempt, AttemptAnswer } from "@prisma/client";

export type ChapterWithQuizzes = Chapter & {
  quizzes: (Quiz & { _count: { attempts: number } })[];
};

export type QuizWithQuestions = Quiz & {
  questions: (Question & { options: Option[] })[];
};

export type AttemptWithDetails = QuizAttempt & {
  answers: (AttemptAnswer & {
    question: Question & { options: Option[] };
    selectedOption: Option;
  })[];
  quiz: Quiz;
};

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
};

export type ChapterMeta = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  articles: ArticleMeta[];
};

export type ChapterProgress = {
  chapterId: string;
  chapterSlug: string;
  completedQuizzes: number;
  totalQuizzes: number;
  bestScore: number | null;
};

export type QuizAnswer = {
  questionId: string;
  selectedOptionId: string;
};
