import { authOptions } from "@/packages/lib/authOptions";
import { FORMS_PER_PAGE, SURVEYS_PER_PAGE, WEBAPP_URL } from "@/packages/lib/constants";
import { getEnvironment } from "@/packages/lib/environment/service";
import { getFormCount } from "@/packages/lib/form/service";
import { getProductByEnvironmentId } from "@/packages/lib/product/service";
import { Button } from "@/packages/ui/Button";
// import { Button } from "@/packages/ui/Button"
import { PageContentWrapper } from "@/packages/ui/PageContentWrapper";
import { PageHeader } from "@/packages/ui/PageHeader";
import { TemplateList } from "@/packages/ui/TemplateList";
import { PlusIcon } from "lucide-react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";


export const metadata: Metadata = {
  title: "Your Forms",
};

interface FormTemplateProps {
    params: {
        environmentId: string;
    }
};

const Page = async ({ params }: FormTemplateProps) => {
    const session = await getServerSession(authOptions);
    const product = await getProductByEnvironmentId(params.environmentId)
     
    if  (!session) {
        throw new Error("Session not found");
    }

    if (!product) {
        throw new Error("Organization not found");
    }

    const environment = await getEnvironment(params.environmentId);
    if (!environment) {
        throw new Error("Environment not found");
    }

    const formCount = await getFormCount(params.environmentId);

    const CreateSurveyButton = (
        <Button
            size="sm"
            href={`/environments/${environment.id}/forms/template`}
            variant="darkCTA"
            EndIcon={PlusIcon}>
            New survey
        </Button>
    );


    return (
        <PageContentWrapper>
            {formCount > 0 ? (
                <>
                    <PageHeader pageTitle="Forms" cta={CreateSurveyButton} />
                    <FormsList 
                        environment={environment}
                        WEBAPP_URL={WEBAPP_URL}
                        userId={session.user.id}
                        formsPerPage={FORMS_PER_PAGE}
                    />
                </>
            ) : (
                <>
                    <h1 className="px-6 text-3xl font-extrabold text-slate-700">
                        You&apos;re all set! Time to create your first survey.
                    </h1>
                    <TemplateList
                        environment={environment}
                        product={product}
                        user={session.user}
                    />
                </>
            )}
            
        </PageContentWrapper>
    )
}

export default Page;