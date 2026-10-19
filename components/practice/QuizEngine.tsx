"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionCard } from "./QuestionCard";
import type { QuizWithQuestions, QuizAnswer } from "@/types";

interface QuizEngineProps {
  quiz: QuizWithQuestions;
  chapterSlug: string;
}

export function QuizEngine({ quiz, chapterSlug }: QuizEngineProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, string>>(new Map());
  const [submitting, setSubmitting] = useState(false);

  const questions = quiz.questions.sort((a, b) => a.order - b.order);
  const current = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  const selectedOption = answers.get(current.id);

  function handleSelect(optionId: string) {
    setAnswers((prev) => new Map(prev).set(current.id, optionId));
  }

  async function handleNext() {
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    await handleSubmit();
  }

  async function handleSubmit() {
    setSubmitting(true);
    const payload: QuizAnswer[] = questions.map((q) => ({
      questionId:       q.id,
      selectedOptionId: answers.get(q.id) ?? "",
    }));

    try {
      const res = await fetch(`/api/quizzes/${quiz.id}/attempt`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ answers: payload }),
      });
      if (!res.ok) throw new Error("Failed to save attempt");
      const { attemptId } = await res.json();
      router.push(`/practice/${chapterSlug}/${quiz.slug}/results?attemptId=${attemptId}`);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Question */}
      <QuestionCard
        question={current}
        selectedOptionId={selectedOption}
        onSelect={handleSelect}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedOption || submitting}
        >
          {isLast ? (submitting ? "Submitting…" : "Submit Quiz") : "Next"}
        </Button>
      </div>
    </div>
  );
}
