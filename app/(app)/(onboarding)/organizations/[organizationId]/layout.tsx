import { PosthogIdentify } from "@/app/(app)/environments/[environmentId]/components/PosthogIdentify";
import { authOptions } from "@/packages/lib/authOptions"
import { getOrganization } from "@/packages/lib/organization/service";
import { ToasterClient } from "@/packages/ui/ToasterClient";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

const ProductOnboardingLayout = async ({ children, params }) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return redirect(`/auth/login`);
    }

    const organization = await getOrganization(params.organizationId);
    if (!organization) {
        throw new Error("Organization not found");
    };

    return (
        <div className="flex-1 bg-slate-50">
            <PosthogIdentify 
                session={session}
                organizationId={organization.id}
                organizationName={organization.name}
                organizationBilling={organization.billing}
            />
            <ToasterClient />
            {children}
        </div>
    );
};

export default ProductOnboardingLayout;