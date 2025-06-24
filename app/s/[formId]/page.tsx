import { ZId } from "@/packages/types/environment";
import { notFound } from "next/navigation";
import { getMetadataForLinkForm } from "./metadata";
import { getForm } from "@/packages/lib/form/service";
import { FormInactive } from "./components/FormInactive";

interface LinkFormPageProps {
    params: {
        formId: string;
    };
};

export const generateMetadata = async ({ params }: LinkFormPageProps) => {
    const validId = ZId.safeParse(params.formId);
    if (!validId.success) {
        notFound();
    }

    return getMetadataForLinkForm(params.formId);
};

const Page = async ({ params }: LinkFormPageProps) => {
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

    // return form ? (

    // ) : null;
};

export default Page;