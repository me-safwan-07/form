import { useCallback, useMemo } from "react";
import { Progress } from "./Progress";
import { TForm } from "@/packages/types/forms";
import { calculateElementIdx } from "../../lib/utils";

interface ProgressBarProps {
  form: TForm;
  questionId: string;
}

export const ProgressBar = ({ form, questionId }: ProgressBarProps) => {
  const currentQuestionIdx = useMemo(
    () => form.questions.findIndex((q) => q.id === questionId),
    [form, questionId]
  );

  const calculateProgress = useCallback(
    (index: number, questionsLength: number) => {
      if (questionsLength === 0) return 0;
      if (index === -1) index = 0;

      const elementIdx = calculateElementIdx(form, index);
      return elementIdx / questionsLength;
    },
    [form]
  );

  const progressArray = useMemo(() => {
    return form.questions.map((_, index) => calculateProgress(index, form.questions.length));
  }, [calculateProgress, form]);

  return (
    <Progress
      progress={questionId === "end" ? 1 : questionId === "start" ? 0 : progressArray[currentQuestionIdx]}
    />
  );
};
