import { FormInline } from "@/packages/FormInline";
import { TForm } from "@/packages/types/forms"
import { TProduct } from "@/packages/types/product";
import { useSearchParams } from "next/navigation";


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
        startAtQuestionId={startAt}
    />
}