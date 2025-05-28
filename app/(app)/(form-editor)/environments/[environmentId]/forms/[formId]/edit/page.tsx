import { authOptions } from "@/packages/lib/authOptions";
import { getEnvironment } from "@/packages/lib/environment/service";
import { getForm } from "@/packages/lib/form/service"
import { getProductByEnvironmentId } from "@/packages/lib/product/service";
import { ErrorComponent } from "@/packages/ui/ErrorComponent";
import { getServerSession } from "next-auth";
import { FormEditor } from "./components/FormEditor";

export const generateMetadata = async ({ params }) => {
    const form = await getForm(params.formId);
    return {
        title: form?.name ? `${form?.name} | Editor` : "Editor",
    };
};

const Page = async ({ params }) => {
    const [
        form,
        product,
        environment,
        session,
    ] =  await Promise.all([
        getForm(params.formId),
        getProductByEnvironmentId(params.environmentId),
        getEnvironment(params.environmentId),
        getServerSession(authOptions),
    ]);

    if (!session) {
        throw new Error("Session not found");
    }

    if (
        !form ||
        !environment ||
        !product
    ) {
        return <ErrorComponent />
    }

    return (
        <FormEditor 
            form={form}
            product={product}
            environment={environment}
        />
    )
}

export default Page;