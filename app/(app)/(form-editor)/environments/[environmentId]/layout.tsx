import { PosthogIdentify } from "@/app/(app)/environments/[environmentId]/components/PosthogIdentify";
import { authOptions } from "@/packages/lib/authOptions"
import { getEnvironment } from "@/packages/lib/environment/service";
import { ToasterClient } from "@/packages/ui/ToasterClient";
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";

const EnvLayout = async ({ children, params }) => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return redirect(`/auth/login`);
    }
    
    const environment = await getEnvironment(params.environmentId);

    if (!environment) {
        throw new Error("Environment not found");
    }

    return (
        <>
            <PosthogIdentify 
                session={session}
                environmentId={params.environmentId}
            />
            <ToasterClient />
            <div className="flex h-screen flex-col">
                <div className="h-full overflow-y-auto bg-slate-50">{children}</div>
            </div>
        </>
    );
};

export default EnvLayout;