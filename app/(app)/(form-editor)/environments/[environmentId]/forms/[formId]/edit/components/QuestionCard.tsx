import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TForm, TFormQuestion } from "@/packages/types/forms";
import { TProduct } from "@/packages/types/product";
import { cn } from "@/packages/lib/cn";
import * as Collapsible from "@radix-ui/react-collapsible";
import { GripIcon } from "lucide-react";
import { Label } from "@/packages/ui/Label";
import { Switch } from "@/packages/ui/Switch";

interface QuestionCardProps {
    localForm: TForm;
    product: TProduct;
    question: TFormQuestion;
    questionIdx: number;
    moveQuestion: (questionIndex: number, up: boolean) => void;
    updateQuestion: (questionIdx: number, updatedAttributes: any) => void;
    deleteQuestion: (questionIdx: number) => void;
    duplicateQuestion: (questionIdx: number) => void;
    activeQuestionId: string | null;
    setActiveQuestionId: (questionId: string | null) => void;
    lastQuestion: boolean;
    addQuestion: (question: any, index?: number) => void;
}

export const QuestionCard = ({
    localForm,
    product,
    question,
    questionIdx,
    moveQuestion,
    updateQuestion,
    duplicateQuestion,
    deleteQuestion,
    activeQuestionId,
    setActiveQuestionId,
    lastQuestion,
    addQuestion,
}: QuestionCardProps) => {

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: question.id,
    });

    const open = activeQuestionId === question.id;

    const style = {
        transition: transition ?? "transform 100ms ease",
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 10 : 1,
    };
  return (

        <div
            className={cn(
                open ? "scale-100 shadow-lg" : "scale-97 shadow-md",
                "flex w-full flex-row rounded-lg bg-white transition-all duration-300 ease-in-out"
            )}
            ref={setNodeRef}
            style={style}
            id={question.id}>
            <div
                {...listeners}
                {...attributes}
                className={cn(
                    open ? "bg-slate-700" : "bg-slate-400",
                    "top-0 w-[5%] rounded-l-lg p-2 text-center text-sm text-white hover:cursor-grab hover:bg-slate-600",
                    // isInvalid && "bg-red-400 hover:bg-red-600",
                    "flex flex-col items-center justify-between"
                )}>
                <span>{questionIdx + 1}</span>

                <button className="opacity-0 hover:cursor-move group-hover:opacity-100">
                    <GripIcon className="h-4 w-4" />
                </button>
            </div>
            <Collapsible.Root
                open={open}
                onOpenChange={() => {
                    if (activeQuestionId !== question.id) {
                        setActiveQuestionId(question.id);
                    } else {
                        setActiveQuestionId(null);
                    }
                }}
                className="w-[95%] flex-1 rounded-r-lg border border-slate-200">
                <Collapsible.CollapsibleTrigger
                    asChild
                    className={cn(open ? "": " ", "flex cursor-pointer justify-between gap-4 p-4 hover:bg-slate-50")}
                >
                    <div>
                        <div className="flex grow">
                            {/* <div className="-ml-0.5 mr-3 h-6 min-w-[1.5rem] text-slate-400"> */}
                                {/* {QUESTION_ICON_MAP} */}
                            {/* </div> */}
                            <div className="grow" dir="auto">
                                <p className="text-sm font-semibold">
                                    {question.headline.default}
                                </p>
                                {!open && question?.required && (
                                    <p className="mt-1 truncate text-xs text-slate-500">{question?.required && "Required"}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </Collapsible.CollapsibleTrigger>

                {open && (
                    <div className="mx-4 flex justify-end space-x-6 border-t border-slate-200">
                        {question.type === "openText" && (
                            <div className="my-4 flex items-center justify-end space-x-2">
                                <Label htmlFor="longAnswer">Long Answer</Label>
                                <Switch
                                    id="longAnswer"
                                    disabled={question.inputType !== "text"}
                                    checked={question.longAnswer !== false}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuestion(questionIdx, {
                                        longAnswer: typeof question.longAnswer === "undefined" ? false : !question.longAnswer,
                                        });
                                    }}
                                />
                            </div>
                        )}
                        {
                            <div className="my-4 flex items-center justify-end space-x-2">
                                <Label htmlFor="required-toggle">Required</Label>
                                <Switch
                                id="required-toggle"
                                checked={question.required}
                                // disabled={getIsRequiredToggleDisabled()}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // handleRequiredToggle();
                                }}
                                />
                            </div>
                        }
                    </div>
                )}
            </Collapsible.Root>
        </div>
    )
}