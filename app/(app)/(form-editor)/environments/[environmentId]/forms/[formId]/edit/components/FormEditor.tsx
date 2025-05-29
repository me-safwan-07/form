'use client';

import { structuredClone } from "@/packages/lib/pollyfills/structuredClone";
import { TForm, TFormEditorTabs } from "@/packages/types/forms";
import { useCallback, useEffect, useRef, useState } from "react";
import { refetchProductAction } from "../../../actions";
import { TProduct } from "@/packages/types/product";
import { useDocumentVisibility } from "@/packages/lib/useDocumentVisibility";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { FormMenuBar } from "./FormMenuBar";
import { TEnvironment } from "@/packages/types/environment";
import { QuestionsAudienceTabs } from "./QuestionsStylingSettingsTabs";
import { QuestionsView } from "./QuestionsView";

interface FormEditorProps {
    form: TForm;
    product: TProduct;
    environment: TEnvironment;
}

export const FormEditor = ({
    form,
    product,
    environment
}: FormEditorProps) => {
    const [activeView, setActiveView] = useState<TFormEditorTabs>("questions")
    const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
    const [localForm, setLocalForm] = useState<TForm | null> (() => structuredClone(form));
    // const [invalidQuestions, setInvalidQuestions] = useState<string[] | null>(null);
    const formEditorRef = useRef(null);
    const [localProduct, setLocalProduct] = useState<TProduct>(product);

    // const [styling, setStyling] = useState(localForm?.styl);
    // const [localStylingChanges, setLocalStylingChanges] = useState<

    const fetchLatestProduct = useCallback(async () => {
        const latestProduct = await refetchProductAction(localProduct.id);
        if (latestProduct) {
            setLocalProduct(latestProduct);
        }
    }, [localProduct.id]);

    useDocumentVisibility(fetchLatestProduct);

    useEffect(() => {
        console.log("LocalForm: ", localForm);
        console.log("form", form);
    }, [localForm, form]);

    useEffect(() => {
        if (form) {
            if (localForm) return;

            const formClone = structuredClone(form);
            setLocalForm(formClone);

            if (form.questions.length > 0) {
                setActiveQuestionId(form.questions[0].id);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);

    useEffect(() => {
        const listener = () => {
            if (document.visibilityState === "visible") {
                const fetchLatestProduct =  async () => {
                    const lastestProduct = await refetchProductAction(localProduct.id);
                    if (lastestProduct) {
                        setLocalProduct(lastestProduct);
                    }
                };
                fetchLatestProduct();
            }
        };
        document.addEventListener("visibilitychange", listener);
        return () => {
            document.removeEventListener("visibilitychange", listener);
        };
    }, [localProduct.id]);

    // When the form type changes, we need to reset the active question id to the first question
    useEffect(() => {
        if (localForm?.questions?.length && localForm.questions.length > 0) {
            setActiveQuestionId(localForm.questions[0].id);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form?.questions]);

    if (!localForm) {
        return <LoadingSkeleton />
    }

    return (
        <>
            <div className="flex h-full w-full flex-col">
                <FormMenuBar 
                    localForm={localForm}
                    form={form}
                    environment={environment}
                    setLocalForm={setLocalForm}
                    product={product}
                />
                <div className="relative z-0 flex flex-1 overflow-hidden">
                    <main
                        className="relative z-0 w-1/2 flex-1 overflow-y-auto focus:outline-none"
                        ref={formEditorRef}>
                        <QuestionsAudienceTabs 
                            activeId={activeView}
                            setActiveId={setActiveView}
                            isStylingTabVisible={!!product.styling.allowStyleOverwrite}
                        />

                        {activeView === "questions" && (
                            <QuestionsView 
                                localForm={localForm}
                                setLocalForm={setLocalForm}
                                activeQuestionId={activeQuestionId}
                                setActiveQuestionId={setActiveQuestionId}
                                product={localProduct}
                            />
                        )}
                    </main>
                </div>
            </div>
        </>
    )
}