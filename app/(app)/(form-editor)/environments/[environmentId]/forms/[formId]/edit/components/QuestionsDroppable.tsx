import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TForm } from "@/packages/types/forms";
import { TProduct } from "@/packages/types/product";
import { QuestionCard } from "./QuestionCard";

interface QuestionsDraggableProps {
    localForm: TForm;
    product: TProduct;
    moveQuestion: (questionIndex: number, up: boolean) => void;
    updateQuestion: (question: number, updatedAttributes: any) => void;
    deleteQuestion: (questionIdx: number) => void;
    duplicateQuestion: (questionIdx: number) => void;
    activeQuestionId: string | null;
    setActiveQuestionId: (questionId: string | null) => void;
    internalQuestionIdMap: Record<string, string>;
    addQuestion: (question:any, index?: number) => void;
}

export const QuestionDroppable = ({
    activeQuestionId,
    deleteQuestion,
    duplicateQuestion,
    localForm,
    moveQuestion,
    product,
    setActiveQuestionId,
    updateQuestion,
    internalQuestionIdMap,
    addQuestion,
}: QuestionsDraggableProps) => {
    return (
        <div className="">
            <SortableContext items={localForm.questions} strategy={verticalListSortingStrategy}>
                {localForm.questions.map((question, questionIdx) => (
                    <QuestionCard
                        key={internalQuestionIdMap[question.id]}
                        localForm={localForm}
                        product={product}
                        question={question}
                        questionIdx={questionIdx}
                        moveQuestion={moveQuestion}
                        updateQuestion={updateQuestion}
                        duplicateQuestion={duplicateQuestion}
                        deleteQuestion={deleteQuestion}
                        activeQuestionId={activeQuestionId}
                        setActiveQuestionId={setActiveQuestionId}
                        lastQuestion={questionIdx === localForm.questions.length - 1}
                        addQuestion={addQuestion}
                    />
                ))}
            </SortableContext>
        </div>
    )
}