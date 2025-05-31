"use client";

import { getQuestionDefaults, QUESTIONS_NAME_MAP } from "@/app/lib/questions";
import { TFormQuestion, TFormQuestionTypeEnum } from "@/packages/types/forms";
import { TProduct } from "@/packages/types/product";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/packages/ui/DropdownMenu";
import { createId } from "@paralleldrive/cuid2";
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, EllipsisIcon, TrashIcon } from "lucide-react";

interface QuestionMenuProps {
    questionIdx: number;
    lastQuestion: boolean;
    duplicateQuestion: (questionIdx: number) => void;
    deleteQuestion: (questionIdx: number) => void;
    moveQuestion: (questionIdx: number, up: boolean) => void;
    question: TFormQuestion;
    product: TProduct;
    // updateQuestion: (questionIdx: number) => void;
    addQuestion: (question: any, index?: number) => void;
}

export const QuestionMenu = ({
    questionIdx,
    lastQuestion,
    duplicateQuestion,
    deleteQuestion,
    moveQuestion,
    question,
    product,
    // updateQuestion,
    addQuestion,
}: QuestionMenuProps) => {
    // const [changeToType, setChangeToType] = useState(question.type);

    // TODO create the change question type functionlity

    const addQuestionBelow = (type: TFormQuestionTypeEnum) => {
        const questionDefaults = getQuestionDefaults(type, product);

        addQuestion(
            {
                ...questionDefaults,
                type,
                id: createId(),
                required: true,
            },
            questionIdx + 1
        );

        // scrolll to the new question
        const section = document.getElementById(`${question.id}`);
        section?.scrollIntoView({ behavior: "smooth", block: "end", inline: 'end' });
    };


    return (
        <div className="flex space-x-2">
            <CopyIcon 
                className="h-4 cursor-pointer text-slate-500 hover:text-slate-600"
                onClick={(e) => {
                    e.stopPropagation();
                    duplicateQuestion(questionIdx);
                }}
            />
            <TrashIcon 
                className="h-4 cursor-pointer text-slate-500 hover:text-slate-600"
                onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(questionIdx);
                }}
            />

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <EllipsisIcon className="h-4 w-4 text-slate-500 hover:text-slate-600"/>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                    <div className="flex flex-col">
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <div className="cursor-pointer text-slate-500 hover:text-slate-600">
                                    <span className="text-xs">Add question below</span>
                                </div>
                            </DropdownMenuSubTrigger>

                            <DropdownMenuSubContent>
                                {Object.entries(QUESTIONS_NAME_MAP).map(([type, name]) => {
                                    if (type === question.type) return null;

                                    return (
                                        <DropdownMenuItem
                                            key={type}
                                            className="min-h-8 cursor-pointer text-slate-500"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addQuestionBelow(type as TFormQuestionTypeEnum);
                                            }}>
                                            <span className="ml-2">{name}</span>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        
                        <DropdownMenuItem 
                            className={`flex min-h-8 cursor justify-between text-slate-500 hover:text-slate-600 ${
                               questionIdx === 0 ? "opacity-50" : "" 
                            }`}
                            onClick={(e) => {
                                if (questionIdx !== 0) {
                                    e.stopPropagation();
                                    moveQuestion(questionIdx, true);
                                }
                            }}
                            disabled={questionIdx === 0}>
                            <span className="text-xs text-slate-500">Move up</span>
                            <ArrowUpIcon className="h-4 w-4" />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            className={`flex min-h-8 cursor-pointer justify-between text-slate-500 hover:text-slate-600 ${
                                lastQuestion ? "opacity-50" : ""
                            }`}
                            onClick={(e) => {
                                if (!lastQuestion) {
                                    e.stopPropagation();
                                    moveQuestion(questionIdx, false);
                                }
                            }}
                            disabled={lastQuestion}>
                            <span className="text-xs text-slate-500">Move down</span>
                            <ArrowDownIcon className="h-4 w-4"/>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}