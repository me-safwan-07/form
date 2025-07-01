import { ZId } from "@/packages/types/environment";
import { notFound } from "next/navigation";
import { getMetadataForLinkForm } from "./metadata";
import { getForm } from "@/packages/lib/form/service";
import { FormInactive } from "./components/FormInactive";
import { LinkForm } from "./components/LinkForm";
import { getProductByEnvironmentId } from "@/packages/lib/product/service";
import { createPerson, getPersonByUserId } from "@/packages/lib/person/service";
import { WEBAPP_URL } from "@/packages/lib/constants";
import { TResponse } from "@/packages/types/responses";
import { getPersonByFormId } from "@/packages/lib/response/service";

interface LinkFormPageProps {
    params: {
        formId: string;
    };
    searchParams: {
        userId?: string;
    }
};

export const generateMetadata = async ({ params }: LinkFormPageProps) => {
    const validId = ZId.safeParse(params.formId);
    if (!validId.success) {
        notFound();
    }

    return getMetadataForLinkForm(params.formId);
};

const Page = async ({ params, searchParams }: LinkFormPageProps) => {
    const validId = ZId.safeParse(params.formId);
    if (!validId.success) {
        notFound();
    }
    const form = await getForm(params.formId);

    if (!form || form.status === "draft") {
        notFound();
    }

    if (form && form.status !== "inProgress") {
        return (
            <FormInactive 
                status={form.status}
                formClosedMessage={undefined} // TODO: add the form closed message when available
            />
        );
    }

    

    // get product and person
    const product = await getProductByEnvironmentId(form.environmentId);
    if (!product) {
        throw new Error("Product not found");
    }

    const userId = searchParams.userId;
    if (userId) {
        // make sure the person exists or get's created
        const person = await getPersonByUserId(form.environmentId, userId);
        if (!person) {
            await createPerson(form.environmentId, userId);
        }
    }

    let singleUseResponse: TResponse | undefined = undefined;
    if (userId) {
        try {
            singleUseResponse = await getPersonByFormId(form.id) ?? undefined;
        } catch (error) {
            singleUseResponse = undefined;
        }
    }
        
    return form ? (
        <LinkForm 
            form={form}
            product={product}
            userId={userId}
            webAppUrl={WEBAPP_URL}
            signleUseResponse={singleUseResponse ? singleUseResponse : undefined}
        />
    ) : null;
};

export default Page;