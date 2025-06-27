import { FormInline } from "@/packages/FormInline";
import { TForm } from "@/packages/types/forms"
import { TProduct } from "@/packages/types/product";
import { set } from "lodash";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";


let setIsError = (_: boolean) => {};
let setIsResponseSendingFinished = (_: boolean) => {};
let setQuestionId = (_: string) => {};


interface LinkFormProps {
    form: TForm;
    product: TProduct;
    webAppUrl: string;
}

export const LinkForm = ({
    form,
    product,
    webAppUrl,
}: LinkFormProps) => {
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


    <FormInline 
        form={form}
        styling={determineStyling()}
        // isBrandingEnabled={product.
        getSetIsError={(f: (value: boolean) => void) => {
            setIsError = f;
        }}
        isPreview={isPreview}
        setQuestionId={setQuestionId}
        determineStyling={determineStyling}
        webAppUrl={webAppUrl}
        autoFocus={autoFocus}
        getSetQuestionId={(f: (value: string) => void) => {
            setQuestionId = f;
        }}
        startAtQuestionId={startAt && isStartAtValid ? startAt : undefined}
    />
}