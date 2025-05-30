"use client";

import { getQuestionDefaults, questionTypes, universalQuestionPresets } from "@/app/lib/questions";
import { cn } from "@/packages/lib/cn";
import { TProduct } from "@/packages/types/product";
import { createId } from "@paralleldrive/cuid2";
import * as Collapsible from "@radix-ui/react-collapsible";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

interface AddQuestionButtonProps {
    addQuestion: (question: any) => void;
    product: TProduct;
}

export const AddQuestionButton = ({ addQuestion, product }: AddQuestionButtonProps) => {
    const [open, setOpen] = useState(false);

    return(
        <Collapsible.Root
            open={open}
            onOpenChange={setOpen}
            className={cn(
                // open ? "scale-100 shadow-lg" : "scale-50 shadow-md",
                "scale-97 group w-full space-y-2 rounded-lg border border-slate-300 bg-white transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-slate-50"
        )}>
            <Collapsible.CollapsibleTrigger asChild className="group h-full w-full">
                <div className="inline-flex">
                    <div className="bg-brand-dark flex w-10 items-center justify-center rounded-l-lg group-aria-expanded:rounded-bl-none group-aria-expanded:rounded-br">
                        <PlusIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="px-4 py-3">
                        <p className="font-semibold">Add Question</p>
                        <p className="mt-1 text-sm text-slate-500">Add a new question to your survey</p>
                    </div>
                </div>
            </Collapsible.CollapsibleTrigger>

            <Collapsible.CollapsibleContent className="justify-left flex flex-col">
                {questionTypes.map((questionType) => (
                    <button
                        type="button"
                        key={questionType.id}
                        className="mx-2 inline-flex items-center rounded p-0.5 px-4 py-2 font-medium text-slate-700 last:mb-2 hover:bg-slate-100 hover:text-slate-800"
                        onClick={() => {
                            addQuestion({
                                ...universalQuestionPresets,
                                ...getQuestionDefaults(questionType.id, product),
                                id: createId(),
                                type: questionType.id,
                            });
                            setOpen(false);
                        }}>
                        <questionType.icon className="text-brand-dark -ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                        {questionType.label}
                    </button>
                ))}
            </Collapsible.CollapsibleContent>
        </Collapsible.Root>
    )
}