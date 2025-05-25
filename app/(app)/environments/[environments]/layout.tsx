import { authOptions } from "@/packages/lib/authOptions";
import { getServerSession } from "next-auth";
import { PosthogIdentify } from "./components/PosthogIdentify";
import { ToasterClient } from "@/packages/ui/ToasterClient";
import { redirect } from "next/navigation";
import { EnvironmentLayout } from "./components/EnvironmentLayout";

const EnvLayout = async ({ children, params }) => {
    const session = await getServerSession(authOptions);
    console.log(session);
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
                {children}
            </EnvironmentLayout>
        </>
    )
};

export default EnvLayout;