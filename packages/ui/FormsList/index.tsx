"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { getFormsAction } from "./actions";
import { TForm, TFormFilters } from "@/packages/types/forms";
import { getFormattedFilters } from "./utils";
import { FormCard } from "./components/FormCard";
import { TEnvironment } from "@/packages/types/environment";

interface FormsListProps {
    environment: TEnvironment;
    WEBAPP_URL: string;
    formsPerPage: number;
}


export const initialFilters: TFormFilters = {
  name: "",
  status: [],
  sortBy: "updatedAt",
};

export const FormsList = ({
    environment,
    WEBAPP_URL,
    formsPerPage: formsLimit,
}: FormsListProps) => {
    const [forms, setForms] = useState<TForm[]>([]);
    const [isFetching, setIsFetching] = useState(true);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const [formFilters, setFormFilters] = useState<TFormFilters>(initialFilters);

    const filters = useMemo(() => getFormattedFilters(formFilters), [formFilters]);
    
    const [orientation, setOrientation] = useState("");

    useEffect(() => {
        // Initialize orientation state with a function that checks if window is defined
        const orientationFromLocalStorage = localStorage.getItem("surveyOrientation");
        if (orientationFromLocalStorage) {
            setOrientation(orientationFromLocalStorage);
        } else {
            setOrientation("grid");
            localStorage.setItem("surveyOrientation", "list");
        }
    }, []);

    useEffect(() => {
        const fetchInitialForms = async () => {
            setIsFetching(true);
            const res = await getFormsAction(environment.id, formsLimit, undefined, filters);
            if (res.length < formsLimit) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
            setForms(res);
            setIsFetching(false);
        };
        fetchInitialForms();
    }, [environment.id, formsLimit, filters]);

    const fetchNextPage = useCallback(async () => {
        setIsFetching(true);
        const newForms = await getFormsAction(environment.id, formsLimit, forms.length, filters);
        if (newForms.length === 0 || newForms.length < formsLimit) {
            setHasMore(false);
        } else {
            setHasMore(true);
        }

        setForms([...forms, ...newForms]);
        setIsFetching(false);
    }, [environment.id, forms, formsLimit, filters]);

    const handleDeleteForm = async (formId: string) => {
        const newForms = forms.filter((form) => form.id !== formId);
        setForms(newForms); 
    };

    const handleDuplicateForm = async (form: TForm) => {
        const newForms = [form, ...forms];
        setForms(newForms);
    }
  
    return (
        <div className="space-y-6">
            {forms.length > 0 ? (
                <div>
                    {orientation === "list" && (
                        <div className="flex-col space-y-3">
                            <div className="mt-6 grid w-full grid-cols-8 place-items-center gap-3 px-6 text-sm text-slate-800">
                                <div className="col-span-4 place-self-start">Name</div>
                                    <div className="col-span-4 grid w-full grid-cols-5 place-items-center">
                                    <div className="col-span-2">Created at</div>
                                    <div className="col-span-2">Updated at</div>
                                </div>
                            </div>

                            {forms.map((form) => {
                                return (
                                    <FormCard 
                                        key={form.id}
                                        form={form}
                                        environment={environment}
                                        WEBAPP_URL={WEBAPP_URL}
                                        orientation={orientation}
                                        duplicateForm={handleDuplicateForm}
                                        deleteForm={handleDeleteForm}
                                    />
                                )
                            })}
                        </div>
                    )}

                    {orientation === "grid" && (
                        <div className="">
                            {forms.map((form) => {
                                return (
                                    <FormCard 
                                        key={form.id}
                                        form={form}
                                        environment={environment}
                                        WEBAPP_URL={WEBAPP_URL}
                                        orientation={orientation}
                                        duplicateForm={handleDuplicateForm}
                                        deleteForm={handleDeleteForm}
                                    />
                                )
                            })}
                        </div>
                    )}

                    {hasMore && (
                        <div className="flex justify-center py-5">
                        <Button onClick={fetchNextPage} variant="secondary" size="sm" loading={isFetching}>
                            Load more
                        </Button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex h-full flex-col items-center justify-center">
                    <span className="mb-4 h-24 w-24 rounded-full bg-slate-100 p-6 text-5xl">🕵️</span>

                    <div className="text-slate-600">{isFetching ? "Fetching surveys..." : "No surveys found"}</div>
                </div>
            )}
        </div>
    )
}