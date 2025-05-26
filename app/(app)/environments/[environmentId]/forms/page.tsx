import { authOptions } from "@/packages/lib/authOptions";
import { WEBAPP_URL } from "@/packages/lib/constants";
import { getEnvironment } from "@/packages/lib/environment/service";
import { getFormCount } from "@/packages/lib/form/service";
import { Button } from "@/packages/ui/Button"
import { PageContentWrapper } from "@/packages/ui/PageContentWrapper";
import { TemplateList } from "@/packages/ui/TemplateList";
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
    if  (!session) {
        throw new Error("Session not found");
    }

    const environment = await getEnvironment(params.environmentId);
    if (!environment) {
        throw new Error("Environment not found");
    }

    const formCount = await getFormCount(params.environmentId);

    console.log(formCount)

    return (
        <PageContentWrapper>
            {formCount > 0 ? (
                <>
                    
                </>
            ) : (
                <>
                    <h1 className="px-6 text-3xl font-extrabold text-slate-700">
                        You&apos;re all set! Time to create your first survey.
                    </h1>
                    <TemplateList
                        environment={environment}
                        // WEBAPP_URL={WEBAPP_URL}
                        userId={session.user}
                    />
                </>
            )}
            
        </PageContentWrapper>
    )
}

export default Page;