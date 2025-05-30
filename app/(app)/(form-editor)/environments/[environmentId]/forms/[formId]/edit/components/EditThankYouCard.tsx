"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { cn } from "@/packages/lib/cn";
import { TForm } from "@/packages/types/forms";

interface EditThankYouCardProps {
    localForm: TForm;
    setLocalForm: (form: TForm) => void;
    setActiveQuestionId: (id: string | null) => void;
    activeQuestionId: string | null;
}

export const EditThankYouCard = ({
    localForm,
    setLocalForm,
    setActiveQuestionId,
    activeQuestionId,
}: EditThankYouCardProps) => {
    let open = activeQuestionId == "end";


    const setOpen = (e) => {
        if (e) {
            setActiveQuestionId("end");
        } else {
            setActiveQuestionId(null);
        }
    };

    const updateForm = (data) => {
        const updatedForm = {
            ...localForm,
            thankYouCard: {
                ...localForm.thankYouCard,
                ...data,
            },
        };
        setLocalForm(updatedForm);
    };

    return (
        <div 
            className={cn(
                open ? "scale-100 shadow-lg" : "scale-97 shadow-md",
                "group z-20 flex-row rounded-lg"
            )}>
                <div 
                    className={cn(
                        open ? "bg-slate-50" : "",
                        "flex w-10 items-center justify-center rounded-l-lg border-b border-l border-t group-aria-expanded:rounded-bl-none",
                        "bg-white group-hover:bg-slate-50"
                    )}>
                    <p>🙏</p>
                </div>
                <Collapsible.Root
                    open={open}
                    onOpenChange={setOpen}
                    className="flex-1 rounded-r-lg border-spacing-2"
                >
                    <Collapsible.CollapsibleTrigger
                        asChild
                        className="flex cursor-pointer justify-between p-4"
                    >
                        <div>
                            <div className="inline-flex">
                                <div>
                                    <p className="text-sm font-semibold">Thank You Card</p>
                                    {!open && (
                                        <p className="">
                                            {localForm?.thankYouCard?.enabled ? "Shown" : "Hidden"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Collapsible.CollapsibleTrigger>
                </Collapsible.Root>
            </div>
    )
}