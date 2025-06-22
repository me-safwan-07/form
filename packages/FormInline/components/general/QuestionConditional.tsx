import { TFormQuestion, TFormQuestionTypeEnum } from "@/packages/types/forms";
import { TResponseData } from "@/packages/types/responses";
import { OpenTextQuestion } from "../questions/OpenTextQuestion";

interface QuestionConditionalProps {
    question: TFormQuestion;
    value: string | number | string[] | Record<string, string>;
    onChange: (responseData: TResponseData) => void;
    onSubmit?: (data: TResponseData) => void;
    onBack: () => void;
    isFirstQuestion: boolean;
    isLastQuestion: boolean;
    currentQuestionId: string;
};

export const QuestionConditional = ({
    question,
    value,
    onChange,
    onSubmit,
    onBack,
    isFirstQuestion,
    isLastQuestion,
    currentQuestionId,
}: QuestionConditionalProps) => {
    return question.type === TFormQuestionTypeEnum.OpenText ? (
        <OpenTextQuestion
            question={question}
            value={value as string}
            onChange={onChange}
            onSubmit={onSubmit}
            onBack={onBack}
            isFirstQuestion={isFirstQuestion}
            isLastQuestion={isLastQuestion}
            autoFocus={currentQuestionId === question.id}
            currentQuestionId={currentQuestionId}
        />
    ) : (
        <div>Unsupported question type</div>
    )

};