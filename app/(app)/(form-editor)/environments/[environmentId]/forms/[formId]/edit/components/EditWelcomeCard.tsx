'use client';

import * as Collapsible from "@radix-ui/react-collapsible";
import { cn } from "@/packages/lib/cn";
import { TForm } from "@/packages/types/forms"
import { useState } from "react";
import { Label } from "@/packages/ui/Label";
import { Switch } from "@/packages/ui/Switch";
import { QuestionFormInput } from "@/packages/ui/QuestionFormInput";
import { Editor } from "@/packages/ui/Editor";
import { md } from "@/packages/lib/markdownIt";


interface EditWelcomeCardProps {
    localForm: TForm;
    setLocalForm: (form: TForm) => void;
    setActiveQuestionId: (id: string | null) => void;
    activeQuestionId: string | null;
    isInvalid?: boolean;
}

export const EditWelcomeCard = ({
    localForm,
    setLocalForm,
    setActiveQuestionId,
    activeQuestionId,
}: EditWelcomeCardProps) => {
    const [firstRender, setFirstRender] = useState(true);

    const open = activeQuestionId == "start";

    const setOpen = (e) => {
        if (e) {
            setActiveQuestionId("start");
            setFirstRender(true);
        } else {
            setActiveQuestionId(null);
        }
    }

    const updateForm = (data: Partial<TForm["welcomeCard"]>) => {
        setLocalForm({
            ...localForm,
            welcomeCard: {
                ...localForm.welcomeCard,
                ...data,
            },
        });
    };

    return (
        <div className={cn(
            open ? "scale-100 shadow-lg" : "scale-97 shadow-md",
            "group flex flex-row rounded-lg bg-white transition-transform duration-300 ease-in-out"
        )}>
             <div
                className={cn(
                open ? "bg-slate-50" : "",
                "flex w-10 items-center justify-center rounded-l-lg border-b border-l border-t group-aria-expanded:rounded-bl-none",
                // isInvalid ? "bg-red-400" : "bg-white group-hover:bg-slate-50"
                )}>
                <p>✋</p>
            </div>
            <Collapsible.Root
                open={open}
                onOpenChange={setOpen}
                className="flex-1 rounded-r-lg border border-slate-200 transition-all duration-300 ease-in-out">
                <Collapsible.CollapsibleTrigger
                    asChild
                    className="flex cursor-pointer justify-between p-4 hover:bg-slate-50">
                    <div>
                        <div className="inline-flex">
                            <div>
                                <p className="text-sm font-semibold">Welcome Card</p>
                                {!open && (
                                    <p className="mt-1 truncate text-xs text-slate-500">
                                        {localForm?.welcomeCard?.enabled ? "Shown" : "Hidden"} 
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Label htmlFor="welcome-toggle">{localForm?.welcomeCard?.enabled ? "On" : "Off"}</Label>
                            
                            <Switch 
                                id="welcome-toggle"
                                checked={localForm?.welcomeCard?.enabled}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateForm({ enabled: !localForm.welcomeCard?.enabled })
                                }}
                            />
                        </div>
                    </div>
                </Collapsible.CollapsibleTrigger>
                <Collapsible.CollapsibleContent className="px-4 pb-6">
                    <form>
                        <div className="mt-2">
                            <Label htmlFor="companyLogo">Company Logo</Label>
                        </div>
                        <div className="mt-3 flex w-full items-center justify-center">
                            {/* TODO after added the file in the form model add the fileInput component */}
                        </div>
                        <div className="mt-3">
                            <QuestionFormInput 
                                id="headline"
                                value={localForm?.welcomeCard?.headline ?? ""}
                                label="Note*"
                                localForm={localForm}
                                questionIdx={-1}
                                updateForm={updateForm}
                            />
                        </div>
                        <div className="mt-3">
                            <Label htmlFor="subheader">Welcome Message</Label>
                            <div className="mt-2">
                                <Editor 
                                    disableLists
                                    excludedToolbarItems={['blockType']}
                                    firstRender={firstRender}
                                    getText={() => md.render(localForm.welcomeCard.html?.["default"] ?? "")}
                                    key={`-1`}
                                    setFirstRender={setFirstRender}
                                    setText={(v: string) => {
                                        if (!localForm.welcomeCard.html) return;
                                        const htmlText = {
                                            ...localForm.welcomeCard.html,
                                            ["default"]: v,
                                        };
                                        updateForm({ html: htmlText });
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </Collapsible.CollapsibleContent>
            </Collapsible.Root>
        </div>
    );
};