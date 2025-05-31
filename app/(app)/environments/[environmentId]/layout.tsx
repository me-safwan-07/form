import { authOptions } from "@/packages/lib/authOptions";
import { getServerSession } from "next-auth";
import { PosthogIdentify } from "../[environmentId]/components/PosthogIdentify";
import { ToasterClient } from "@/packages/ui/ToasterClient";
import { redirect } from "next/navigation";
import { EnvironmentLayout } from "../[environmentId]/components/EnvironmentLayout";

const EnvLayout = async ({ children, params }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        return redirect("/auth/login");
    }
    

    return (
        <>
            <PosthogIdentify 
                session={session}
                environmentId={params.environmentId}
            />
            <ToasterClient />
            <EnvironmentLayout environmentId={params.environmentId}>
                {children}c 
            </EnvironmentLayout>
        </>
    )
};

export default EnvLayout;