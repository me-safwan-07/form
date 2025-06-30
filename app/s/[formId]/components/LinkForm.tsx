import { PlayerFormAPI } from "@/packages/api";
import { FormInline } from "@/packages/FormInline";
import { FormState } from "@/packages/lib/formState";
import { ResponseQueue } from "@/packages/lib/responseQueue";
import { TForm } from "@/packages/types/forms"
import { TProduct } from "@/packages/types/product";
import { TResponse, TResponseData, TResponseUpdate } from "@/packages/types/responses";
import { set } from "lodash";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";


let setIsError = (_: boolean) => {};
let setIsResponseSendingFinished = (_: boolean) => {};
let setQuestionId = (_: string) => {};


interface LinkFormProps {
    form: TForm;
    product: TProduct;
    userId?: string;
    webAppUrl: string;
    signleUseResponse?: TResponse;
}

export const LinkForm = ({
    form,
    product,
    userId,
    webAppUrl,
    signleUseResponse,
}: LinkFormProps) => {
    const responseId = signleUseResponse?.id;
    const searchParams = useSearchParams();
    const isPreview = searchParams?.get("preview") === "true";

    const startAt = searchParams?.get("startAt");
    const isStartAtValid = useMemo(() => {
        if (!startAt) return false;
        if (form?.welcomeCard.enabled && startAt === "start") return true;

        const isValid = form?.questions.some((question) => question.id === startAt);

        // To remove startAt query param from URL if it is not valid:
        if (!isValid && typeof window !== "undefined") {
            const url = new URL(window.location.href);
            url.searchParams.delete("startAt");
            window.history.replaceState({}, "", url.toString());
        }

        return isValid;
    }, [form, startAt]);
    
    const determineStyling = () => {
        // allow style overwrite is disabled from the product
        if (!product.styling.allowStyleOverwrite) {
            return product.styling;
        }

        // allow style overwrite is enabled from the product
        if (product.styling.allowStyleOverwrite) {
            // form style overwrite is disabled
            if (!form.styling?.overwriteThemeStyling) {
                return product.styling;
            }

            // form style overwrite is enabled
            return form.styling;
        }

        return product.styling;
    };
    const [autoFocus, setAutofocus] = useState(false);

    // pass in the responseId if the form is a single  use form, ensures form state is updated with the responseId
    let formState = useMemo(() => {
        return new FormState(form.id, responseId, userId);
    }, [form.id, responseId, userId]);
    
    const responseQueue = useMemo(
        () => 
            new ResponseQueue(
                {
                    apiHost: webAppUrl,
                    environmentId: form.environmentId,
                    retryAttempts: 2,
                    onResponseSendingFailed: () => {
                        setIsError(true);
                    },
                    onResponseSendingFinished: () => {
                        // when response is current question is processed successfully
                        setIsResponseSendingFinished(true);
                    }
                },
                formState,
            ),
        [webAppUrl, form.environmentId, formState]        
    );


    <FormInline 
        form={form}
        styling={determineStyling()}
        // shouldResetQuestionId={false}
        getSetIsError={(f: (value: boolean) => void) => {
            setIsError = f;
        }}
        getSetIsResponseSendingFinished={
            !isPreview
                ? (f: (value: boolean) => void) => {
                    setIsResponseSendingFinished = f;
                }
                : undefined
        }
        onRetry={() => {
            setIsError(false);
            responseQueue.processQueue();
        }}
        onDisplay={async () => {
            if (!isPreview) {
                const api = new PlayerFormAPI({
                    apiHost: webAppUrl,
                    environmentId: form.environmentId,
                });
                const res = await api.client.display.create({
                    formId: form.id,
                });
                if (!res.ok) {
                    throw new Error("Could not create display");
                }
                const { id } = res.data;

                formState.updateDisplayId(id);
                responseQueue.updateFormState(formState);
            }
        }}
        onResponse={(responseUpdate: TResponseUpdate) => {
            return (
                !isPreview &&
                responseQueue.add({
                    data: {
                        ...responseUpdate.data,
                    },
                    finished: responseUpdate.finished,
                })
            );
        }}
        // TODO: add the onFileUpload props
        autoFocus={autoFocus}
        getSetQuestionId={(f: (value: string) => void) => {
            setQuestionId = f;
        }}
        startAtQuestionId={startAt && isStartAtValid ? startAt : undefined}
        setQuestionId={setQuestionId}
        determineStyling={determineStyling}
        webAppUrl={webAppUrl}
    />
}