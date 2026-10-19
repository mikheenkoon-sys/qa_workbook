import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Option, Question } from "@prisma/client";

interface QuestionCardProps {
  question: Question & { options: Option[] };
  selectedOptionId: string | undefined;
  onSelect: (optionId: string) => void;
  /** Show correct/wrong state after submission */
  revealed?: boolean;
}

export function QuestionCard({ question, selectedOptionId, onSelect, revealed }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <p className="text-base font-medium leading-relaxed">{question.text}</p>

      <div className="space-y-2">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.isCorrect;

          let variant: string = "outline";
          if (revealed) {
            if (isCorrect) variant = "correct";
            else if (isSelected && !isCorrect) variant = "wrong";
          } else if (isSelected) {
            variant = "selected";
          }

          return (
            <button
              key={option.id}
              onClick={() => !revealed && onSelect(option.id)}
              disabled={revealed}
              className={cn(
                "w-full rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                variant === "outline"   && "border-border bg-background hover:bg-muted",
                variant === "selected"  && "border-primary bg-primary/10",
                variant === "correct"   && "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
                variant === "wrong"     && "border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
                revealed && !isSelected && !isCorrect && "opacity-50"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span>{option.text}</span>
                {revealed && isCorrect && <Badge className="bg-green-500 text-white shrink-0">Correct</Badge>}
                {revealed && isSelected && !isCorrect && <Badge variant="destructive" className="shrink-0">Wrong</Badge>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
